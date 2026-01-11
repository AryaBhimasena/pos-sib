/* ======================================================
   Ledger Keuangan Helper
====================================================== */

/* ================= TANGGAL ================= */

export function getDefaultMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthRange(month) {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);

  const f = d =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;

  return {
    tanggalAwal: f(start),
    tanggalAkhir: f(end),
  };
}

export function formatTanggalID(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${d}-${m}-${y}`;
}

export function toDateNumber(dateStr) {
  return new Date(dateStr).getTime();
}

/* ================= FILTER ================= */

export function filterLedgerRows(rows, {
  jenisFilter,
  tanggalAwal,
  tanggalAkhir,
}) {
  return rows.filter(r => {
    if (jenisFilter && r.jenis !== jenisFilter) return false;
    if (tanggalAwal && r.tanggal < tanggalAwal) return false;
    if (tanggalAkhir && r.tanggal > tanggalAkhir) return false;
    return true;
  });
}

/* ================= SORT + SALDO ================= */

export function orderLedgerRowsWithSaldo(rows) {
  const data = [...rows];

  data.sort((a, b) => {
    // 1. tanggal
    const t = toDateNumber(a.tanggal) - toDateNumber(b.tanggal);
    if (t !== 0) return t;

    // 2. debit dulu, lalu kredit
    if (a.debit > 0 && b.kredit > 0) return -1;
    if (a.kredit > 0 && b.debit > 0) return 1;

    return 0;
  });

  let saldo = 0;
  return data.map(r => {
    saldo += r.debit;
    saldo -= r.kredit;
    return { ...r, saldo };
  });
}

export function normalizeISODateToYMD(value) {
  if (!value) return "";

  const d = new Date(value);
  if (isNaN(d.getTime())) return "";

  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");

  return `${y}-${m}-${day}`;
}

export function normalizeModalBarangRows(rows = []) {
  if (!Array.isArray(rows)) return [];

  return rows.map(r => ({
    ID_Barang: r.ID_Barang ?? "",
    NamaBarang: r.NamaBarang ?? "",
    tanggal: normalizeISODateToYMD(r.created_at),
    hargaModal: Number(r.hargaModal) || 0,
  }));
}

export function filterModalBarangByTanggal(
  rows = [],
  { tanggalAwal, tanggalAkhir }
) {
  return rows.filter(r => {
    if (!r.tanggal) return false;
    if (tanggalAwal && r.tanggal < tanggalAwal) return false;
    if (tanggalAkhir && r.tanggal > tanggalAkhir) return false;
    return true;
  });
}

export function sumModalBarang(rows = []) {
  return rows.reduce((sum, r) => sum + (r.hargaModal || 0), 0);
}
