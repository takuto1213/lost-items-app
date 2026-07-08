"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerItem, uploadImage } from "@/lib/api";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "", desc: "", found: "", storage: ""
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  }

  async function handleSubmit() {
    if (!form.name || !form.found || !form.storage) {
      alert("名前・発見場所・保管場所は必須です");
      return;
    }
    setLoading(true);
    let imageUrl = "";
    if (imageFile) {
      imageUrl = await uploadImage(imageFile);
    }
    await registerItem({ ...form, imageUrl });
    alert("登録しました！");
    router.push("/");
  }

  return (
    <div>
      <Link href="/" style={{color: "#2563eb"}} className="text-sm">← 一覧に戻る</Link>
      <h2 className="text-xl font-bold mt-4 mb-5" style={{color: "#1e293b"}}>📝 落とし物を登録する</h2>

      <div className="space-y-4">
        {[
          { label: "落とし物の名前 *", key: "name", placeholder: "例：財布" },
          { label: "特徴・説明", key: "desc", placeholder: "例：黒い革財布" },
          { label: "発見した場所 *", key: "found", placeholder: "例：正門前" },
          { label: "保管している場所 *", key: "storage", placeholder: "例：事務室" },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium mb-1" style={{color: "#374151"}}>{label}</label>
            <input
              style={{backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#1e293b"}}
              className="w-full p-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-300"
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium mb-1" style={{color: "#374151"}}>写真（任意）</label>
          <input
            type="file"
            accept="image/*"
            style={{backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#1e293b"}}
            className="w-full p-3 rounded-xl text-sm"
            onChange={handleImageChange}
          />
          {preview && (
            <img src={preview} alt="プレビュー" className="w-full rounded-xl mt-2 object-cover max-h-48" />
          )}
        </div>

        <button
          style={{backgroundColor: loading ? "#93c5fd" : "#2563eb", color: "#ffffff"}}
          className="w-full py-3 rounded-xl font-bold text-sm transition"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "登録中..." : "登録する"}
        </button>
      </div>
    </div>
  );
}