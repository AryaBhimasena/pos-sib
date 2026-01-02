"use client";

import { useEffect, useMemo, useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import { postAPI } from "@/lib/api";
import "@/styles/pages/penjualan.css";
import SalesModal from "@/components/penjualan/SalesModal";

export default function TransaksiPenjualanPage() {
  const [list, setList] = useState([]);
  const [search, setSearch] = useState("");
  const [statusBayar, setStatusBayar] = useState("");
  const [metodeBayar, setMetodeBayar] = useState("");
  const [openModal, setOpenModal] = useState(false);
const [editingData, setEditingData] = useState(null);

const handleEdit = row => {
  setEditingData(row);
  setOpenModal(true);
};

const fetchData = async () => {
  const res = await postAPI("apiGetTransaksiPenjualan");

  if (res?.status !== "OK") {
    setList([]);
    return;
  }

  const rows = Array.isArray(res.data) ? res.data : [];

  const normalized = rows.map(r => ({
    id: r.ID_Penjualan,
    tanggal: r.Tanggal,
    namaPelanggan: r.NamaPelanggan,
    totalItem: Number(r.TotalItem || 0),
    totalHarga: Number(r.TotalHarga || 0),
    metodeBayar: r.MetodeBayar,
    statusBayar: r.StatusBayar,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  }));

  setList(normalized);
};

useEffect(() => {
  fetchData();
}, []);
  
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
    omzet: filtered.reduce((a, b) => a + b.totalHarga, 0),
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

<button className="action primary" onClick={() => setOpenModal(true)}>
  + Penjualan Baru
</button>

<SalesModal
  open={openModal}
  data={editingData}
  onClose={() => {
    setOpenModal(false);
    setEditingData(null);
    fetchData(); // refresh table setelah simpan
  }}
/>


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
			<th>Aksi</th>
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
      Rp {row.totalHarga.toLocaleString("id-ID")}
    </td>
    <td>
      <button
        className="btn small"
        onClick={() => handleEdit(row)}
      >
        Edit
      </button>
    </td>
  </tr>
))}

        </tbody>
      </table>
    </ContainerCard>
  );
}
