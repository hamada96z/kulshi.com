"use client";
import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../lib/firebase";
import ListingCard from "../components/ListingCard";
import { useSearchParams } from "next/navigation";
import { texts } from "../lib/texts";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "ar";
  const t = texts[texts[lang] ? lang : "ar"];

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const q = query(collection(db, "listings"), orderBy("createdAt", "desc"));
        const snap = await getDocs(q);
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setItems(list);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold mb-1">{t.brand}</h1>
        <p className="text-gray-600">{t.subtitle}</p>
      </div>
      <h2 className="text-lg font-semibold">{t.latestListings}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : items.length === 0 ? (
        <div className="text-gray-500 text-sm">Noch keine Anzeigen.</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((it) => (
            <ListingCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </div>
  );
}
