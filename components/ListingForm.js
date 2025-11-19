"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { texts } from "../lib/texts";
import { auth, db, storage } from "../lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function ListingForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("SYP");
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const lang = searchParams.get("lang") || "ar";
  const t = texts[texts[lang] ? lang : "ar"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const user = auth.currentUser;
    if (!user) {
      alert("Bitte zuerst einloggen.");
      setLoading(false);
      return;
    }

    let thumbnailUrl = null;
    try {
      if (imageFile) {
        const storageRef = ref(storage, `thumbs/${Date.now()}-${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        thumbnailUrl = await getDownloadURL(snapshot.ref);
      }

      await addDoc(collection(db, "listings"), {
        title,
        description,
        price: parseFloat(price || "0"),
        currency,
        thumbnailUrl,
        ownerUid: user.uid,
        status: "active",
        createdAt: serverTimestamp()
      });

      router.push("/?lang=" + lang);
    } catch (e) {
      console.error(e);
      alert("Fehler beim Speichern.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-3 max-w-xl" onSubmit={handleSubmit}>
      <input
        className="w-full border rounded px-3 py-2"
        placeholder={t.title}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        className="w-full border rounded px-3 py-2"
        placeholder={t.description}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <div className="flex gap-2">
        <input
          type="number"
          className="w-1/2 border rounded px-3 py-2"
          placeholder={t.price}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <select
          className="w-1/2 border rounded px-3 py-2"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="SYP">SYP</option>
          <option value="TRY">TRY</option>
          <option value="EUR">EUR</option>
          <option value="USD">USD</option>
        </select>
      </div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImageFile(e.target.files?.[0] || null)}
      />
      <button
        disabled={loading}
        className="bg-gray-900 text-white px-4 py-2 rounded"
      >
        {loading ? "..." : t.create}
      </button>
    </form>
  );
}
