"use client";

import { useEffect, useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import "@/styles/pages/laporan.css";

/* ================= INITIAL STATE ================= */
const initialState = {
  summary: {
    pendapatan: 0,
    beban: 0,
    laba: 0,
  },
  pembayaran: {
    cash: 0,
    transfer: 0,
  },
  jasa: {
    total: 0,
    hakTeknisi: 0,
    hakOutlet: 0,
  },
  teknisi: [],
  supplier: [],
};

/* ================= DUMMY DATA ================= */
const dummyLaporan = {
  summary: {
    pendapatan: 2850000,
    beban: 1950000,
    laba: 900000,
  },
  pembayaran: {
    cash: 1750000,
    transfer: 1100000,
  },
  jasa: {
    total: 1500000,
    hakTeknisi: 900000,
    hakOutlet: 600000,
  },
  teknisi: [
    {
      id: "T001",
      nama: "Andi Saputra",
      jumlahService: 12,
      totalHak: 390000,
      sudahDibayar: 250000,
      sisaBelumDibayar: 140000,
    },
    {
      id: "T002",
      nama: "Budi Santoso",
      jumlahService: 8,
      totalHak: 300000,
      sudahDibayar: 300000,
      sisaBelumDibayar: 0,
    },
    {
      id: "T003",
      nama: "Rizky Pratama",
      jumlahService: 6,
      totalHak: 210000,
      sudahDibayar: 0,
      sisaBelumDibayar: 210000,
    },
  ],
  supplier: [
    {
      supplier: "PT Sumber Jaya Parts",
      pembelian: 850000,
      penjualan: 1250000,
      margin: 400000,
    },
    {
      supplier: "CV Mega Elektronik",
      pembelian: 600000,
      penjualan: 900000,
      margin: 300000,
    },
  ],
};

export default function LaporanPage() {
  const [data, setData] = useState(initialState);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [mode, setMode] = useState("bulanan");

  const fetchData = async () => {
    setData(dummyLaporan);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ContainerCard>
      {/* ================= HEADER ================= */}
      <div className="laporan-header">
        <div>
          <h2>Laporan Keuangan</h2>
          <p>Laba rugi, jasa service, dan kewajiban teknisi</p>
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="laporan-filter">
        <div className="filter-group">
          <label>Periode Awal</label>
          <input type="date" value={start} onChange={e => setStart(e.target.value)} />
        </div>

        <div className="filter-group">
          <label>Periode Akhir</label>
          <input type="date" value={end} onChange={e => setEnd(e.target.value)} />
        </div>

        <div className="filter-group">
          <label>Mode</label>
          <select value={mode} onChange={e => setMode(e.target.value)}>
            <option value="harian">Harian</option>
            <option value="bulanan">Bulanan</option>
          </select>
        </div>

        <button className="action primary" onClick={fetchData}>
          Terapkan
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="laporan-summary">
        <div className="summary-card">
          <span>Total Pendapatan</span>
          <strong>Rp {data.summary.pendapatan.toLocaleString("id-ID")}</strong>
        </div>

        <div className="summary-card expense">
          <span>Total Beban</span>
          <strong>Rp {data.summary.beban.toLocaleString("id-ID")}</strong>
        </div>

        <div className="summary-card profit">
          <span>Laba Bersih</span>
          <strong>Rp {data.summary.laba.toLocaleString("id-ID")}</strong>
        </div>

        <div className="summary-card info">
          <span>Cash / Transfer</span>
          <strong>
            Rp {data.pembayaran.cash.toLocaleString("id-ID")} / Rp{" "}
            {data.pembayaran.transfer.toLocaleString("id-ID")}
          </strong>
        </div>
      </div>

      {/* ================= DISTRIBUSI + TEKNISI ================= */}
      <div className="laporan-dual">
        {/* KIRI 30% */}
        <section className="laporan-section jasa-section">
          <h3>Distribusi Jasa Service</h3>
          <table className="laporan-table">
            <tbody>
              <tr>
                <td>Total Jasa</td>
                <td className="right">Rp {data.jasa.total.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>Hak Teknisi</td>
                <td className="right">Rp {data.jasa.hakTeknisi.toLocaleString("id-ID")}</td>
              </tr>
              <tr>
                <td>Hak Outlet</td>
                <td className="right">Rp {data.jasa.hakOutlet.toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* KANAN 70% */}
        <section className="laporan-section teknisi-section">
          <h3>Rekap Hak Teknisi (Bulanan)</h3>
          <table className="laporan-table">
            <thead>
              <tr>
                <th>Teknisi</th>
                <th className="right">Service</th>
                <th className="right">Total Hak</th>
                <th className="right">Sudah Dibayar</th>
                <th className="right">Sisa</th>
              </tr>
            </thead>
            <tbody>
              {data.teknisi.map(t => (
                <tr key={t.id}>
                  <td>{t.nama}</td>
                  <td className="right">{t.jumlahService}</td>
                  <td className="right">Rp {t.totalHak.toLocaleString("id-ID")}</td>
                  <td className="right paid-text">
                    Rp {t.sudahDibayar.toLocaleString("id-ID")}
                  </td>
                  <td className="right unpaid-text">
                    Rp {t.sisaBelumDibayar.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      {/* ================= SUPPLIER ================= */}
      <section className="laporan-section">
        <h3>Supplier (Part)</h3>
        <table className="laporan-table">
          <thead>
            <tr>
              <th>Supplier</th>
              <th className="right">Pembelian</th>
              <th className="right">Penjualan</th>
              <th className="right">Margin</th>
            </tr>
          </thead>
          <tbody>
            {data.supplier.map(row => (
              <tr key={row.supplier}>
                <td>{row.supplier}</td>
                <td className="right">Rp {row.pembelian.toLocaleString("id-ID")}</td>
                <td className="right">Rp {row.penjualan.toLocaleString("id-ID")}</td>
                <td className="right profit-text">
                  Rp {row.margin.toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </ContainerCard>
  );
}
