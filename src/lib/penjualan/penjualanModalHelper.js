/* =====================================================
 * PENJUALAN MODAL HELPER
 * Path : lib/penjualan/penjualanModalHelper.js
 * ===================================================== */

import { postAPI } from "@/lib/api";

/* =====================================================
 * FORMAT NO NOTA
 * SLS-ddmmyy0001
 * ===================================================== */
function formatNota(tanggal, urut) {
  const d = new Date(tanggal);

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(-2);

  return `SLS-${dd}${mm}${yy}${String(urut).padStart(4, "0")}`;
}

/* =====================================================
 * AUTO GENERATE NO NOTA PENJUALAN (UI BASED)
 * - Read tbl_TransaksiPenjualan
 * - Filter by tanggal
 * - Hitung urutan
 * ===================================================== */
export async function generateNotaPenjualan(tanggal) {
  if (!tanggal) {
    throw new Error("Tanggal wajib diisi untuk generate nota");
  }

  const res = await postAPI({
    action: "apiGetTransaksiPenjualan",
  });

  const rows = Array.isArray(res?.data)
    ? res.data
    : Array.isArray(res?.data?.data)
    ? res.data.data
    : [];

  // samakan format tanggal (yyyy-mm-dd)
  const todayRows = rows.filter(r => {
    if (!r.tanggal) return false;
    return r.tanggal === tanggal;
  });

  const nextUrut = todayRows.length + 1;

  return formatNota(tanggal, nextUrut);
}

/* =====================================================
 * GET BARANG TERSEDIA
 * Endpoint: path = barang
 * Filter: status === "TERSEDIA"
 * jsonResponse: { status, data }
 * ===================================================== */
export async function getBarangTersedia() {
  const res = await postAPI("barang");

  if (res?.status !== "OK") {
    return [];
  }

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
 * INIT MODAL PENJUALAN
 * - generate nota
 * - load barang tersedia
 * ===================================================== */
export async function initPenjualanModal(tanggal) {
  const [noNota, barangList] = await Promise.all([
    generateNotaPenjualan(tanggal),
    getBarangTersedia(),
  ]);

  return {
    noNota,
    barangList,
  };
}
/* =====================================================
 * HANDLE SUBMIT TRANSAKSI PENJUALAN
 * - Pure function
 * - Tidak tahu React / event
 * ===================================================== */
export async function submitPenjualan(body) {
  const res = await postAPI("apiSaveTransaksiPenjualan", body);

  if (res?.status !== "OK") {
    throw new Error(res?.data?.message || "Gagal menyimpan transaksi");
  }

  return res.data;
}

// lib/penjualan/penjualanModalHelper.js
export async function loadDetailBarang(noNota) {
  const res = await postAPI("apiGetPenjualanByNota", { noNota });

  if (res?.status !== "OK") {
    throw new Error(res?.data?.message || "Gagal memuat detail penjualan");
  }

  return res.data; // { header, items }
}
