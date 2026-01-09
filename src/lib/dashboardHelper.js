/* ======================================================
   DASHBOARD HELPER
   Lokasi: lib/dashboardHelper.js
====================================================== */

import { postAPI } from "@/lib/api";

/* ======================================================
   FETCH SERVICE + KPI + REKAP TEKNISI
====================================================== */
export async function fetchDashboardService({
  setServiceList,
  setKpiServiceDiterima,
  setKpiServiceDiambil,
  setServiceByTeknisi,
}) {

  try {
    console.log("=== FETCH DASHBOARD SERVICE: START ===");

    const json = await postAPI("apiGetTransaksiService");

    console.log("RAW RESPONSE:", json);

    if (json.status !== "OK") {
      console.warn("STATUS BACKEND TIDAK OK");
      return;
    }

    const data = json.data || [];
    console.log("JUMLAH DATA DARI BACKEND:", data.length);
    console.log("SAMPLE RECORD 1:", data[0]);

    // ===============================
    // LOG DISTRIBUSI STATUS
    // ===============================
    const statusDistribusi = data.reduce((acc, s) => {
      acc[s.statusService] = (acc[s.statusService] || 0) + 1;
      return acc;
    }, {});

    console.log("DISTRIBUSI STATUS SERVICE:", statusDistribusi);

    // ===============================
    // LIST SERVICE TERBARU (SEMUA STATUS)
    // ===============================
    const serviceSorted = [...data].sort((a, b) => {
      const da = new Date(a.tanggalTerima || a.created_at);
      const db = new Date(b.tanggalTerima || b.created_at);
      return db - da;
    });

    console.log("SERVICE TERURUT TERBARU:", serviceSorted);

    setServiceList(serviceSorted);

// ===============================
// KPI SERVICE (OPERASIONAL)
// ===============================
const tanggalOperasional = new Date(
  serviceSorted[0].tanggalTerima
).toLocaleDateString("sv-SE");

let totalDiterima = 0;
let totalDiambil = 0;

data.forEach(s => {
  const tglLocal = new Date(s.tanggalTerima)
    .toLocaleDateString("sv-SE");

  if (tglLocal !== tanggalOperasional) return;

  if (s.statusService === "DITERIMA") totalDiterima++;
  if (s.statusService === "DIAMBIL") totalDiambil++;
});

console.log("KPI SERVICE (OPERASIONAL):", {
  tanggal: tanggalOperasional,
  DITERIMA: totalDiterima,
  DIAMBIL: totalDiambil,
});

// ⬇️⬇️⬇️ INI YANG PALING PENTING
setKpiServiceDiterima(totalDiterima);
setKpiServiceDiambil(totalDiambil);


    // ===============================
    // REKAP PER TEKNISI BULAN AKTIF
    // ===============================
    const now = new Date();
    const bulan = now.getMonth();
    const tahun = now.getFullYear();

    console.log("PERIODE REKAP:", bulan + 1, tahun);

    const mapTeknisi = {};

    data.forEach(s => {
      if (!s.teknisi) return;

      const tgl = new Date(s.tanggalTerima || s.created_at);
      if (isNaN(tgl.getTime())) return;

      if (tgl.getMonth() === bulan && tgl.getFullYear() === tahun) {
        mapTeknisi[s.teknisi] = (mapTeknisi[s.teknisi] || 0) + 1;
      }
    });

    console.log("MAP REKAP TEKNISI MENTAH:", mapTeknisi);

    const rekap = Object.entries(mapTeknisi)
      .map(([teknisi, total]) => ({ teknisi, total }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 3);

    console.log("TOP TEKNISI BULAN INI:", rekap);

    setServiceByTeknisi(rekap);

    console.log("=== FETCH DASHBOARD SERVICE: END ===");
  } catch (err) {
    console.error("FETCH SERVICE ERROR:", err);
  }
}

/* ======================================================
   FETCH BARANG (MASTER DATA)
====================================================== */
export async function fetchDashboardBarang({ setBarangList }) {
  try {
    const res = await postAPI("barang");

    if (res.status === "OK") {
      const rows = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.data)
        ? res.data.data
        : [];

      setBarangList(rows);
    }
  } catch (err) {
    console.error("FETCH BARANG ERROR:", err);
  }
}

/* ======================================================
   FILTER BARANG (DROPDOWN SEARCH)
====================================================== */
export function filterBarang(barangList, searchBarang) {
  return Array.isArray(barangList)
    ? barangList.filter(item => {
        if (!searchBarang) return false;

        const keyword = searchBarang.toLowerCase();

        return (
          item.nama?.toLowerCase().includes(keyword) ||
          item.sku?.toLowerCase().includes(keyword) ||
          item.id?.toLowerCase().includes(keyword)
        );
      })
    : [];
}

/* ======================================================
   FORMAT TANGGAL dd-mm-yyyy
====================================================== */
export function formatTanggal(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "-";

  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
}
