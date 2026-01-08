"use client";

import { useEffect, useMemo, useState } from "react";
import { postAPI } from "@/lib/api";
import "@/styles/ledger-keuangan-tab.css";

function getDefaultMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

function getMonthRange(month) {
  const [y, m] = month.split("-").map(Number);
  const start = new Date(y, m - 1, 1);
  const end = new Date(y, m, 0);
  const f = d =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate()
    ).padStart(2, "0")}`;
  return { tanggalAwal: f(start), tanggalAkhir: f(end) };
}

export default function LedgerKeuanganTab() {
  const [rows, setRows] = useState([]);
  const [bulanAktif, setBulanAktif] = useState(getDefaultMonth());
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchLedger = async bulan => {
    setLoading(true);
    try {
      const range = getMonthRange(bulan);
      const res = await postAPI("get-ledger-keuangan", range);
      const data = Array.isArray(res?.data) ? res.data : [];
      setRows(
        data.map(r => ({
          tanggal: r.Tanggal,
          jenis: r.JenisTransaksi,
          ref: r.RefTransaksi || "",
          debit: Number(r.Debit || 0),
          kredit: Number(r.Kredit || 0),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger(bulanAktif);
  }, [bulanAktif]);

  const filteredRows = useMemo(() => {
    return rows.filter(r => {
      if (jenisFilter && r.jenis !== jenisFilter) return false;
      if (tanggalAwal && r.tanggal < tanggalAwal) return false;
      if (tanggalAkhir && r.tanggal > tanggalAkhir) return false;
      return true;
    });
  }, [rows, jenisFilter, tanggalAwal, tanggalAkhir]);

const laporan = useMemo(() => {
  let service = 0;
  let penjualan = 0;
  let komisi = 0;

  filteredRows.forEach(r => {
    if (r.jenis === "Service") service += r.debit;
    if (r.jenis === "Penjualan") penjualan += r.debit;
    if (r.jenis === "Bayar Teknisi") komisi += r.kredit;
  });

  return {
    service,
    penjualan,
    totalPemasukan: service + penjualan,
    komisi,
    totalPengeluaran: komisi,
  };
}, [filteredRows]);

  const jenisList = [...new Set(rows.map(r => r.jenis))];

  return (
    <div className="ledger-layout">
      {/* LEFT */}
      <aside className="ledger-panel">
        <h3 className="panel-title">Ringkasan Ledger Keuangan</h3>

        <div className="filter-block">
          <div className="date-row">
            <input
              type="date"
              value={tanggalAwal}
              onChange={e => setTanggalAwal(e.target.value)}
            />
            <span>–</span>
            <input
              type="date"
              value={tanggalAkhir}
              onChange={e => setTanggalAkhir(e.target.value)}
            />
          </div>

          <input
            type="month"
            value={bulanAktif}
            onChange={e => {
              setTanggalAwal("");
              setTanggalAkhir("");
              setBulanAktif(e.target.value);
            }}
          />
        </div>

<table className="summary">
  <thead>
    <tr>
      <th>Transaksi</th>
      <th className="num">Debit</th>
      <th className="num">Kredit</th>
    </tr>
  </thead>
  <tbody>
    {/* PEMASUKAN */}
    <tr>
      <td>Service</td>
      <td className="num">
        {laporan.service.toLocaleString("id-ID")}
      </td>
      <td />
    </tr>
    <tr>
      <td>Penjualan</td>
      <td className="num">
        {laporan.penjualan.toLocaleString("id-ID")}
      </td>
      <td />
    </tr>
    <tr className="subtotal">
      <td>Total Pemasukan</td>
      <td className="num">
        {laporan.totalPemasukan.toLocaleString("id-ID")}
      </td>
      <td />
    </tr>

    {/* PENGELUARAN */}
    <tr>
      <td>Komisi Teknisi</td>
      <td />
      <td className="num">
        {laporan.komisi.toLocaleString("id-ID")}
      </td>
    </tr>
    <tr className="subtotal">
      <td>Total Pengeluaran</td>
      <td />
      <td className="num">
        {laporan.totalPengeluaran.toLocaleString("id-ID")}
      </td>
    </tr>
  </tbody>
</table>

      </aside>

      {/* RIGHT */}
      <section className="ledger-table-wrap">
        <div className="table-header">
          <h3>Detail Transaksi</h3>
          <select
            value={jenisFilter}
            onChange={e => setJenisFilter(e.target.value)}
          >
            <option value="">Semua Jenis Transaksi</option>
            {jenisList.map(j => (
              <option key={j}>{j}</option>
            ))}
          </select>
        </div>

        <div className="table-body">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Transaksi</th>
                <th>Referensi</th>
                <th className="num">Debit</th>
                <th className="num">Kredit</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={5} className="center">
                    Memuat data…
                  </td>
                </tr>
              )}
              {!loading &&
                filteredRows.map((r, i) => (
                  <tr key={i}>
                    <td>{r.tanggal}</td>
                    <td>{r.jenis}</td>
                    <td>{r.ref}</td>
                    <td className="num">
                      {r.debit ? r.debit.toLocaleString("id-ID") : ""}
                    </td>
                    <td className="num">
                      {r.kredit ? r.kredit.toLocaleString("id-ID") : ""}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
