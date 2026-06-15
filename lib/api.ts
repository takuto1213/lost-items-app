const API_URL = process.env.NEXT_PUBLIC_API_URL!;

export type Item = {
  id: string;
  date: string;
  name: string;
  desc: string;
  found: string;
  storage: string;
  status: string;
  imageUrl: string;
};

export async function getItems(): Promise<Item[]> {
  const res = await fetch(API_URL, { cache: "no-store" });
  return res.json();
}

export async function registerItem(data: {
  name: string;
  desc: string;
  found: string;
  storage: string;
  imageUrl: string;
}) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function uploadImage(file: File): Promise<string> {
  const base64 = await fileToBase64(file);
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "uploadImage",
      base64,
      mimeType: file.type,
      fileName: file.name,
    }),
  });
  const json = await res.json();
  return json.imageUrl;
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function completeItem(id: string) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "complete", id }),
  });
}

export async function deleteItem(id: string) {
  await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify({ action: "delete", id }),
  });
}