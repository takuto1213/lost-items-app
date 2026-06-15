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
    <main className="p-4 max-w-xl mx-auto">
      <Link href="/" className="text-blue-500">← 一覧に戻る</Link>
      <h1 className="text-2xl font-bold mt-4 mb-4">📝 落とし物を登録する</h1>

      <label className="block mb-1 font-bold">落とし物の名前 *</label>
      <input
        className="border w-full p-2 mb-3 rounded"
        placeholder="例：財布"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />

      <label className="block mb-1 font-bold">特徴・説明</label>
      <input
        className="border w-full p-2 mb-3 rounded"
        placeholder="例：黒い革財布"
        value={form.desc}
        onChange={e => setForm({ ...form, desc: e.target.value })}
      />

      <label className="block mb-1 font-bold">発見した場所 *</label>
      <input
        className="border w-full p-2 mb-3 rounded"
        placeholder="例：正門前"
        value={form.found}
        onChange={e => setForm({ ...form, found: e.target.value })}
      />

      <label className="block mb-1 font-bold">保管している場所 *</label>
      <input
        className="border w-full p-2 mb-3 rounded"
        placeholder="例：事務室"
        value={form.storage}
        onChange={e => setForm({ ...form, storage: e.target.value })}
      />

      <label className="block mb-1 font-bold">写真（任意）</label>
      <input
        type="file"
        accept="image/*"
        className="border w-full p-2 mb-3 rounded"
        onChange={handleImageChange}
      />
      {preview && (
        <img
          src={preview}
          alt="プレビュー"
          className="w-full rounded mb-3 object-cover max-h-48"
        />
      )}

      <button
        className="bg-blue-500 text-white w-full py-3 rounded font-bold disabled:opacity-50"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "登録中...（写真がある場合は少し時間がかかります）" : "登録する"}
      </button>
    </main>
  );
}