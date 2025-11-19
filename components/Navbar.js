"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { texts } from "../lib/texts";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";

function useLang() {
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "ar";
  return texts[lang] ? lang : "ar";
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = useLang();
  const t = texts[lang];

  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const navTo = (path) => {
    const params = new URLSearchParams(searchParams.toString());
    router.push(path + "?" + params.toString());
  };

  const changeLang = (l) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("lang", l);
    router.push(pathname + "?" + params.toString());
  };

  return (
    <header className="border-b bg-white/80 backdrop-blur sticky top-0 z-10">
      <div className="container flex items-center justify-between py-3">
        <button onClick={() => navTo("/")} className="text-lg font-semibold">
          {t.brand}
        </button>
        <nav className="flex items-center gap-3 text-sm">
          <button onClick={() => navTo("/")} className="hover:underline">
            {t.home}
          </button>
          <button onClick={() => navTo("/listings/new")} className="hover:underline">
            {t.newListing}
          </button>
          {user ? (
            <button
              onClick={async () => {
                await signOut(auth);
                router.refresh();
              }}
              className="hover:underline"
            >
              {t.logout}
            </button>
          ) : (
            <button onClick={() => navTo("/login")} className="hover:underline">
              {t.login}
            </button>
          )}
          <div className="flex gap-1">
            {["ar","en","de","tr"].map((l)=>(
              <button
                key={l}
                onClick={() => changeLang(l)}
                className={"px-1 rounded " + (l===lang?"bg-gray-900 text-white":"bg-gray-100")}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </nav>
      </div>
    </header>
  );
}
