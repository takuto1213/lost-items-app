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
      <span style={{backgroundColor: "#fee2e2", color: "#dc2626"}} className="text-xs px-2 py-0.5 rounded-full font-medium">
        期限切れ
      </span>
    );
    if (days <= 3) return (
      <span style={{backgroundColor: "#ffedd5", color: "#ea580c"}} className="text-xs px-2 py-0.5 rounded-full font-medium">
        残り{days}日
      </span>
    );
    return (
      <span style={{backgroundColor: "#dbeafe", color: "#2563eb"}} className="text-xs px-2 py-0.5 rounded-full font-medium">
        残り{days}日
      </span>
    );
  }

  return (
    <div>
      <Link href="/register">
        <button style={{backgroundColor: "#2563eb", color: "#ffffff"}} className="w-full py-3 rounded-xl font-bold mb-5 shadow-sm hover:opacity-90 transition">
          ＋ 落とし物を登録する
        </button>
      </Link>

      <div style={{backgroundColor: "#ffffff", border: "1px solid #e2e8f0"}} className="rounded-xl p-3 mb-4 shadow-sm">
        <input
          className="w-full p-2 text-sm outline-none"
          style={{color: "#1e293b", backgroundColor: "transparent"}}
          placeholder="🔍 名前・場所・説明で検索"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="flex gap-2 mb-5">
        {["すべて", "保管中", "返却済"].map(s => (
          <button
            key={s}
            style={statusFilter === s
              ? {backgroundColor: "#2563eb", color: "#ffffff", border: "1px solid #2563eb"}
              : {backgroundColor: "#ffffff", color: "#64748b", border: "1px solid #e2e8f0"}
            }
            className="px-4 py-1.5 rounded-full text-sm font-medium transition"
            onClick={() => setStatusFilter(s)}
          >
            {s}
          </button>
        ))}
      </div>

      {loading && (
        <div className="text-center py-10" style={{color: "#94a3b8"}}>
          読み込み中...
        </div>
      )}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-10" style={{color: "#94a3b8"}}>
          該当する落とし物はありません
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((item: Item) => {
          const days = calcRemainingDays(item.deadline);
          const isExpired = days < 0;
          return (
            <Link href={`/detail/${String(item.id)}`} key={String(item.id)}>
              <div
                style={{
                  backgroundColor: "#ffffff",
                  border: isExpired ? "1px solid #fca5a5" : "1px solid #e2e8f0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.08)"
                }}
                className="rounded-xl p-4 hover:shadow-md transition cursor-pointer"
              >
                <div className="flex justify-between items-start mb-2">
                  <p className="font-bold text-base" style={{color: "#1e293b"}}>{item.name}</p>
                  <div className="flex gap-1 items-center flex-wrap justify-end">
                    <DeadlineBadge deadline={item.deadline} />
                    <span
                      style={item.status === "保管中"
                        ? {backgroundColor: "#dcfce7", color: "#16a34a"}
                        : {backgroundColor: "#f1f5f9", color: "#64748b"}
                      }
                      className="text-xs px-2 py-0.5 rounded-full font-medium"
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm" style={{color: "#64748b"}}>📍 {item.found}で発見</p>
                <p className="text-xs mt-1" style={{color: "#94a3b8"}}>{item.date}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}