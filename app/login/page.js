"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { auth } from "../../lib/firebase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { texts } from "../../lib/texts";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "ar";
  const t = texts[texts[lang] ? lang : "ar"];

  const [mode, setMode] = useState("login"); // login | register
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) router.push("/?lang=" + lang);
    });
    return () => unsub();
  }, [router, lang]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (e) {
      console.error(e);
      alert("Fehler bei Authentifizierung");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white mt-8 p-4 rounded shadow space-y-4">
      <h1 className="text-lg font-semibold">
        {mode === "login" ? t.login : "Registrieren"}
      </h1>
      <form className="space-y-3" onSubmit={handleSubmit}>
        <input
          type="email"
          className="w-full border rounded px-3 py-2"
          placeholder="E-Mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          className="w-full border rounded px-3 py-2"
          placeholder="Passwort (min. 6 Zeichen)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          disabled={loading}
          className="bg-gray-900 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "..." : mode === "login" ? t.login : "Registrieren"}
        </button>
      </form>
      <button
        className="text-xs text-gray-600 underline"
        onClick={() => setMode(mode === "login" ? "register" : "login")}
      >
        {mode === "login" ? "Noch kein Konto? Registrieren" : "Schon ein Konto? Login"}
      </button>
    </div>
  );
}
