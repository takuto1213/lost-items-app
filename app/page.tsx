"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Item, calcRemainingDays } from "@/lib/api";

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("すべて");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/gas")
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = items.filter(item => {
    const matchSearch =
      item.name.includes(search) ||
      item.found.includes(search) ||
      item.storage.includes(search) ||
      item.desc.includes(search);
    const matchStatus =
      statusFilter === "すべて" || item.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function DeadlineBadge({ deadline }: { deadline: string }) {
    const days = calcRemainingDays(deadline);
    if (!deadline) return null;
    if (days < 0) return (
      <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
        期限切れ
      </span>
    );
    if (days <= 3) return (
      <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded">
        残り{days}日
      </span>
    );
    return (
      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
        残り{days}日
      </span>
    );
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 落とし物一覧</h1>

      <Link href="/register">
        <button className="mb-4 bg-blue-500 text-white px-4 py-2 rounded w-full">
          ＋ 落とし物を登録する
        </button>
      </Link>

      <input
        className="border w-full p-2 mb-2 rounded"
        placeholder="名前・場所・説明で検索"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      <div className="flex gap-2 mb-4">
        {["すべて", "保管中", "返却済"].map(s => (
          <button
            key={s}
            className={`px-3 py-1 rounded text-sm border ${
              statusFilter === s
                ? "bg-blue-500 text-white border-blue-500"
                : "bg-white text-gray-600 border-gray-300"
            }`}
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && <p className="text-gray-500">読み込み中...</p>}
      {!loading && filtered.length === 0 && (
        <p className="text-gray-500">該当する落とし物はありません</p>
      )}
      {filtered.map((item: Item) => {
        const days = calcRemainingDays(item.deadline);
        const isExpired = days < 0;
        return (
          <Link href={`/detail/${String(item.id)}`} key={String(item.id)}>
            <div className={`border rounded p-3 mb-2 hover:bg-gray-50 cursor-pointer ${
              isExpired ? "border-red-300 bg-red-50" : ""
            }`}>
              <div className="flex justify-between items-start">
                <p className="font-bold">{item.name}</p>
                <div className="flex gap-1 items-center">
                  <DeadlineBadge deadline={item.deadline} />
                  <span className={`text-sm px-2 py-0.5 rounded ${
                    item.status === "保管中"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-500"
                  }`}>
                    {item.status}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">📍 {item.found}で発見</p>
              <p className="text-sm text-gray-400">{item.date}</p>
            </div>
          </Link>
        );
      })}
    </main>
  );
}