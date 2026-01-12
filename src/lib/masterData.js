import { postAPI } from "./api";

/**
 * Ambil seluruh master data untuk form Barang
 */
export async function fetchMasterDataBarang() {
  const json = await postAPI("masterdata/get");

  if (json.status !== "OK") {
    throw new Error("Gagal mengambil master data");
  }

  const {
    kategoriBarang,
    merekPart,
    merekHP,
    lokasiStock,
    supplier,
  } = json.data;

  return {
    kategoriBarang: filterAktif(kategoriBarang),
    merekPart: filterAktif(merekPart),
    merekHP: filterAktif(merekHP),
    lokasiStock,
    supplier: filterAktif(supplier),
  };
}

/* ================= HELPER ================= */

/**
 * Filter data dengan Status === "AKTIF"
 */
function filterAktif(arr = []) {
  return arr.filter(
    item => String(item.Status).trim().toUpperCase() === "AKTIF"
  );
}