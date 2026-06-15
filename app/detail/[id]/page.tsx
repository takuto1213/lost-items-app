import { getItems, Item } from "@/lib/api";
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
      <main className="p-4">
        <p>見つかりませんでした</p>
        <Link href="/" className="text-blue-500">← 一覧に戻る</Link>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-xl mx-auto">
      <Link href="/" className="text-blue-500">← 一覧に戻る</Link>
      <h1 className="text-2xl font-bold mt-4 mb-4">{item.name}</h1>

      {item.imageUrl && (
        <a href={item.imageUrl} target="_blank" rel="noopener noreferrer">
          <img
            src={item.imageUrl.replace(
              "https://drive.google.com/uc?id=",
              "https://lh3.googleusercontent.com/d/"
            )}
            alt={item.name}
            className="w-full rounded mb-4 object-cover max-h-64"
          />
        </a>
      )}

      <div className="border rounded p-4 space-y-2 mb-4">
        <p>📋 説明：{item.desc || "なし"}</p>
        <p>📍 発見場所：{item.found}</p>
        <p>🗂 保管場所：{item.storage}</p>
        <p>📅 登録日時：{item.date}</p>
        <p>
          状態：
          <span className={`ml-2 px-2 py-0.5 rounded text-sm ${
            item.status === "保管中"
              ? "bg-green-100 text-green-700"
              : "bg-gray-200 text-gray-500"
          }`}>
            {item.status}
          </span>
        </p>
      </div>

      <DetailActions id={item.id} status={item.status} />
    </main>
  );
}