"use client";
import { useRouter } from "next/navigation";
import { completeItem, deleteItem } from "@/lib/api";

export default function DetailActions({
  id,
  status,
}: {
  id: string;
  status: string;
}) {
  const router = useRouter();

  async function handleComplete() {
    if (!confirm("返却済みにしますか？")) return;
    await completeItem(id);
    alert("返却済みにしました！");
    router.push("/");
  }

  async function handleDelete() {
    if (!confirm("本当に削除しますか？")) return;
    await deleteItem(id);
    alert("削除しました！");
    router.push("/");
  }

  return (
    <div className="space-y-2">
      {status === "保管中" && (
        <button
          className="bg-green-500 text-white w-full py-3 rounded font-bold"
          onClick={handleComplete}
        >
          ✅ 返却済みにする
        </button>
      )}
      <button
        className="bg-red-500 text-white w-full py-3 rounded font-bold"
        onClick={handleDelete}
      >
        🗑 削除する
      </button>
    </div>
  );
}