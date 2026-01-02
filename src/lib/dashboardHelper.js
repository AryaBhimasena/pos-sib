/* ======================================================
   DASHBOARD HELPER
   Lokasi: lib/dashboardHelper.js
   Catatan:
   - TIDAK ada perubahan logic
   - TIDAK ada refactor internal
   - Hanya pemindahan fungsi
====================================================== */

import { postAPI } from "@/lib/api";

/* ======================================================
   FETCH SERVICE + KPI + REKAP TEKNISI
====================================================== */
export async function fetchDashboardService({
  setServiceList,
  setKpiServiceDiterima,
  setServiceByTeknisi,
}) {
  try {
    const json = await postAPI("apiGetTransaksiService");

    if (json.status === "OK") {
      const diterima = json.data
        .filter(s => s.statusService === "DITERIMA")
        .sort((a, b) => {
          const da = new Date(a.created_at || a.tanggalTerima);
          const db = new Date(b.created_at || b.tanggalTerima);
          return db - da;
        });

      setServiceList(diterima);

      // KPI Service Hari Ini
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const totalHariIni = diterima.filter(s => {
        let tgl = null;

        if (s.created_at) tgl = new Date(s.created_at);
        else if (s.tanggalTerima) tgl = new Date(s.tanggalTerima);

        if (!tgl || isNaN(tgl.getTime())) return false;

        tgl.setHours(0, 0, 0, 0);
        return tgl.getTime() === today.getTime();
      }).length;

      setKpiServiceDiterima(totalHariIni);

      // ===============================
      // REKAP SERVICE PER TEKNISI (BULAN AKTIF)
      // ===============================
      const now = new Date();
      const bulan = now.getMonth();
      const tahun = now.getFullYear();

      const mapTeknisi = {};

      json.data.forEach(s => {
        if (!s.teknisi) return;

        const tgl = new Date(s.created_at || s.tanggalTerima);
        if (isNaN(tgl.getTime())) return;

        if (tgl.getMonth() === bulan && tgl.getFullYear() === tahun) {
          mapTeknisi[s.teknisi] =
            (mapTeknisi[s.teknisi] || 0) + 1;
        }
      });

      const rekap = Object.entries(mapTeknisi)
        .map(([nama, total]) => ({ nama, total }))
        .sort((a, b) => b.total - a.total)
        .slice(0, 3);

      setServiceByTeknisi(rekap);
    }
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
