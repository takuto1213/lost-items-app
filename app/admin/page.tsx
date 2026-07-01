"use client";
import { useState, useEffect } from "react";
import { Item } from "@/lib/api";

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD!;

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
    if (password === ADMIN_PASSWORD) {
      setLoggedIn(true);
      loadItems();
    } else {
      setError("パスワードが違います");
    }
  }

  async function loadItems() {
    setLoading(true);
    const res = await fetch("/api/gas");
    const data = await res.json();
    setItems(data);
    setLoading(false);
  }

  async function handleComplete(id: string) {
    if (!confirm("返却済みにしますか？")) return;
    await fetch("/api/gas", {
      method: "POST",
      body: JSON.stringify({ action: "complete", id }),
    });
    loadItems();
  }

  async function handleDelete(id: string) {
    if (!confirm("本当に削除しますか？")) return;
    await fetch("/api/gas", {
      method: "POST",
      body: JSON.stringify({ action: "delete", id }),
    });
    loadItems();
  }

  if (!loggedIn) {
    return (
      <main className="p-4 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">🔒 管理者ログイン</h1>
        <input
          type="password"
          className="border w-full p-2 mb-3 rounded"
          placeholder="パスワードを入力"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
        />
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <button
          className="bg-blue-500 text-white w-full py-3 rounded font-bold"
          onClick={handleLogin}
        >
          ログイン
        </button>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🛠 管理者画面</h1>
      <button
        className="mb-4 bg-gray-200 px-3 py-1 rounded text-sm"
        onClick={loadItems}
      >
        🔄 更新
      </button>

      {loading && <p className="text-gray-500">読み込み中...</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">名前</th>
              <th className="border p-2 text-left">発見場所</th>
              <th className="border p-2 text-left">保管場所</th>
              <th className="border p-2 text-left">状態</th>
              <th className="border p-2 text-left">登録日時</th>
              <th className="border p-2 text-left">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border p-2">{item.name}</td>
                <td className="border p-2">{item.found}</td>
                <td className="border p-2">{item.storage}</td>
                <td className="border p-2">
                  <span className={`px-2 py-0.5 rounded text-xs ${
                    item.status === "保管中"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="border p-2">{item.date}</td>
                <td className="border p-2">
                  <div className="flex gap-1">
                    {item.status === "保管中" && (
                      <button
                        className="bg-green-500 text-white px-2 py-1 rounded text-xs"
                        onClick={() => handleComplete(item.id)}
                      >
                        返却済
                      </button>
                    )}
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                      onClick={() => handleDelete(item.id)}
                    >
                      削除
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}