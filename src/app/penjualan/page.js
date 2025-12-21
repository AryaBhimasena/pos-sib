"use client";

import { useEffect, useMemo, useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import { postAPI } from "@/lib/api";
import "@/styles/pages/penjualan.css";

export default function TransaksiPenjualanPage() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusBayar, setStatusBayar] = useState("");
  const [metodeBayar, setMetodeBayar] = useState("");

  const fetchData = async () => {
    const res = await postAPI({
      action: "apiGetTransaksiPenjualan", // tbl_TransaksiPenjualan
    });

    const rows = Array.isArray(res?.data)
      ? res.data
      : Array.isArray(res?.data?.data)
      ? res.data.data
      : [];

    setList(rows);
  };
  
const statusClass = {
  "Lunas": "lunas",
  "Belum Lunas": "belum-lunas",
};

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return list.filter(r => {
      if (statusBayar && r.statusBayar !== statusBayar) return false;
      if (metodeBayar && r.metodeBayar !== metodeBayar) return false;
      if (
        search &&
        !`${r.id} ${r.namaPelanggan || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ) return false;
      return true;
    });
  }, [list, search, statusBayar, metodeBayar]);

  const summary = useMemo(() => {
    return {
      total: filtered.length,
      lunas: filtered.filter(r => r.statusBayar === "Lunas").length,
      pending: filtered.filter(r => r.statusBayar !== "Lunas").length,
      omzet: filtered.reduce((a, b) => a + (b.totalBarang || 0), 0),
    };
  }, [filtered]);

  return (
    <ContainerCard>
      {/* ================= HEADER ================= */}
      <div className="transaksi-header">
        <div>
          <h2>Penjualan</h2>
          <p>Transaksi penjualan part dan aksesoris</p>
        </div>

        <button className="action primary">
          + Penjualan Baru
        </button>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="transaksi-summary">
        <div className="summary-card">
          <span>Total Transaksi</span>
          <strong>{summary.total}</strong>
        </div>

        <div className="summary-card success">
          <span>Lunas</span>
          <strong>{summary.lunas}</strong>
        </div>

        <div className="summary-card warning">
          <span>Belum Lunas</span>
          <strong>{summary.pending}</strong>
        </div>

        <div className="summary-card primary">
          <span>Omzet</span>
          <strong>
            Rp {summary.omzet.toLocaleString("id-ID")}
          </strong>
        </div>
      </div>

      {/* ================= FILTER ================= */}
      <div className="transaksi-toolbar">
        <input
          placeholder="Cari nota / pelanggan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select value={metodeBayar} onChange={e => setMetodeBayar(e.target.value)}>
          <option value="">Semua Metode</option>
          <option value="Cash">Cash</option>
          <option value="Transfer">Transfer</option>
          <option value="QRIS">QRIS</option>
        </select>

        <select value={statusBayar} onChange={e => setStatusBayar(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="Lunas">Lunas</option>
          <option value="Belum Lunas">Belum Lunas</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <table className="transaksi-table">
        <thead>
          <tr>
            <th>No Nota</th>
            <th>Tanggal</th>
            <th>Pelanggan</th>
            <th>Metode</th>
            <th>Status</th>
            <th className="right">Total</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 && (
            <tr>
              <td colSpan="6" className="empty">
                Tidak ada data
              </td>
            </tr>
          )}

          {filtered.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{row.tanggal}</td>
              <td>{row.namaPelanggan || "-"}</td>
              <td>{row.metodeBayar}</td>
              <td>
				<span className={`status ${statusClass[row.statusBayar] || ""}`}>
				  {row.statusBayar}
				</span>
              </td>
              <td className="right">
                Rp {Number(row.totalBarang || 0).toLocaleString("id-ID")}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </ContainerCard>
  );
}
