import { postAPI } from "@/lib/api";

/* =====================================================
 * GET BARANG TERSEDIA (SHARED)
 * ===================================================== */
export async function getBarangTersedia() {
  const res = await postAPI("barang");

  if (res?.status !== "OK") return [];

  const rows = Array.isArray(res.data) ? res.data : [];

  return rows
    .filter(b => String(b.status).toUpperCase() === "TERSEDIA")
    .map(b => ({
      id: b.id,
      namaBarang: b.nama,
      hargaJual: Number(b.hargaJual || 0),
      sku: b.sku,
      kategori: b.kategori,
      merekPart: b.merekPart,
      merekHP: b.merekHP,
    }));
}

/* =====================================================
 * REQUEST NO NOTA (CREATE ONLY)
 * ===================================================== */
export async function requestNoNotaPenjualan(tanggal) {
  if (!tanggal) {
    throw new Error("Tanggal wajib diisi");
  }

  const res = await postAPI("apiGenerateNotaPenjualan", { tanggal });

  if (res?.status !== "OK") {
    throw new Error(res?.data?.message || "Gagal generate no nota");
  }

  return res.data.noNota;
}

/* =====================================================
 * INIT MODAL PENJUALAN (CREATE ONLY)
 * ⚠️ JANGAN DIPAKAI SAAT EDIT
 * ===================================================== */
export async function initPenjualanModal(tanggal) {
  if (!tanggal) {
    throw new Error("Tanggal wajib diisi");
  }

  const [barangList, noNota] = await Promise.all([
    getBarangTersedia(),
    requestNoNotaPenjualan(tanggal),
  ]);

  if (!noNota) {
    throw new Error("No nota tidak berhasil dibuat");
  }

  return {
    noNota,
    barangList,
  };
}

/* =====================================================
 * SUBMIT TRANSAKSI (CREATE / EDIT)
 * ===================================================== */
export async function submitPenjualan(body) {
  const res = await postAPI("apiSaveTransaksiPenjualan", body);

  if (res?.status !== "OK") {
    throw new Error(res?.data?.message || "Gagal menyimpan transaksi");
  }

  return res.data;
}

/* =====================================================
 * LOAD DETAIL PENJUALAN (EDIT ONLY)
 * ===================================================== */
export async function loadDetailBarang(noNota) {
  if (!noNota) {
    throw new Error("No nota wajib diisi");
  }

  const res = await postAPI("apiGetPenjualanByNota", { noNota });

  if (res?.status !== "OK") {
    throw new Error(res?.data?.message || "Gagal memuat detail penjualan");
  }

  return res.data; // { header, items }
}
