// src/lib/barangService.js

export async function getBarangList() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_GAS_URL}?path=barang`,
    { cache: "no-store" }
  );

  const json = await res.json();
  if (!res.ok) throw new Error(json.message);

  return json.data;
}
