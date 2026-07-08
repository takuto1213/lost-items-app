import { getItems, Item, calcRemainingDays } from "@/lib/api";
import Link from "next/link";
import DetailActions from "./DetailActions";

export default async function DetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await props.params;
  const items = await getItems();
  const item = items.find((i: Item) => i.id === id);

  if (!item) {
    return (
      <div>
        <p style={{color: "#64748b"}}>見つかりませんでした</p>
        <Link href="/" style={{color: "#2563eb"}}>← 一覧に戻る</Link>
      </div>
    );
  }

  const days = calcRemainingDays(item.deadline);
  const isExpired = days < 0;

  return (
    <div>
      <Link href="/" style={{color: "#2563eb"}} className="text-sm">← 一覧に戻る</Link>
      <h2 className="text-xl font-bold mt-4 mb-4" style={{color: "#1e293b"}}>{item.name}</h2>

      {item.imageUrl && (
        <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={item.imageUrl.replace(
              "https://drive.google.com/uc?id=",
              "https://lh3.googleusercontent.com/d/"
            )}
            alt={item.name}
            className="w-full rounded-xl mb-4 object-cover max-h-64"
          />
        </a>
      )}

      <div style={{backgroundColor: "#ffffff", border: "1px solid #e2e8f0", boxShadow: "0 1px 3px rgba(0,0,0,0.08)"}} className="rounded-xl p-4 space-y-3 mb-4">
        <p className="text-sm" style={{color: "#374151"}}>📋 説明：{item.desc || "なし"}</p>
        <p className="text-sm" style={{color: "#374151"}}>📍 発見場所：{item.found}</p>
        <p className="text-sm" style={{color: "#374151"}}>🗂 保管場所：{item.storage}</p>
        <p className="text-sm" style={{color: "#374151"}}>📅 登録日時：{item.date}</p>
        {item.deadline && (
          <p className="text-sm font-medium" style={{color: isExpired ? "#dc2626" : "#374151"}}>
            ⏰ 保管期限：{item.deadline}
            {isExpired ? "（期限切れ）" : `（残り${days}日）`}
          </p>
        )}
        <div className="flex items-center gap-2">
          <span className="text-sm" style={{color: "#374151"}}>状態：</span>
          <span
            style={item.status === "保管中"
              ? {backgroundColor: "#dcfce7", color: "#16a34a"}
              : {backgroundColor: "#f1f5f9", color: "#64748b"}
            }
            className="text-xs px-3 py-1 rounded-full font-medium"
          >
            {item.status}
          </span>
        </div>
      </div>

      <DetailActions id={item.id} status={item.status} />
    </div>
  );
}