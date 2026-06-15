import Link from "next/link";

export const dynamic = "force-dynamic";

async function getItems() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/gas";
    const res = await fetch(baseUrl, { cache: "no-store" });
    return await res.json();
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const items = await getItems();

  return (
    <main className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🔍 落とし物一覧</h1>
      <Link href="/register">
        <button className="mb-6 bg-blue-500 text-white px-4 py-2 rounded w-full">
          ＋ 落とし物を登録する
        </button>
      </Link>
      {items.length === 0 && (
        <p className="text-gray-500">登録されている落とし物はありません</p>
      )}
      {items.map((item: any) => (
        <Link href={`/detail/${String(item.id)}`} key={String(item.id)}>
          <div className="border rounded p-3 mb-2 hover:bg-gray-50 cursor-pointer">
            <div className="flex justify-between">
              <p className="font-bold">{item.name}</p>
              <span className={`text-sm px-2 py-0.5 rounded ${
                item.status === "保管中"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-500"
              }`}>
                {item.status}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-1">📍 {item.found}で発見</p>
            <p className="text-sm text-gray-400">{item.date}</p>
          </div>
        </Link>
      ))}
    </main>
  );
}