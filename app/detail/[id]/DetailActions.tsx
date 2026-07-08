"use client";
import { useRouter } from "next/navigation";
import { completeItem } from "@/lib/api";

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

  return (
    <div>
      {status === "保管中" && (
        <button
          style={{backgroundColor: "#16a34a", color: "#ffffff"}}
          className="w-full py-3 rounded-xl font-bold text-sm"
          onClick={handleComplete}
        >
          ✅ 返却済みにする
        </button>
      )}
    </div>
  );
}