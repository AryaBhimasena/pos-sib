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

  const [activeMonth, setActiveMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const handleEdit = row => {
    setEditingData({ noNota: row.id });
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
    Lunas: "lunas",
    "Belum Lunas": "belum-lunas",
  };

  const filtered = useMemo(() => {
    return list.filter(r => {
      if (activeMonth) {
        const month = r.tanggal?.slice(0, 7);
        if (month !== activeMonth) return false;
      }
      if (statusBayar && r.statusBayar !== statusBayar) return false;
      if (metodeBayar && r.metodeBayar !== metodeBayar) return false;
      if (
        search &&
        !`${r.id} ${r.namaPelanggan || ""}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
        return false;
      return true;
    });
  }, [list, search, statusBayar, metodeBayar, activeMonth]);

  const summary = useMemo(() => {
    const lunas = filtered.filter(r => r.statusBayar === "Lunas");
    const belum = filtered.filter(r => r.statusBayar !== "Lunas");

    return {
      totalTransaksi: filtered.length,
      lunasCount: lunas.length,
      belumCount: belum.length,
      totalLunas: lunas.reduce((a, b) => a + b.totalHarga, 0),
      totalBON: belum.reduce((a, b) => a + b.totalHarga, 0),
    };
  }, [filtered]);

  const formatTanggal = iso => {
    if (!iso) return "-";
    const d = new Date(iso);
    return d.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <ContainerCard>
      {/* ================= HEADER ================= */}
      <div className="transaksi-header">
        <div>
          <h2>Penjualan</h2>
          <p>Transaksi penjualan part dan aksesoris</p>
        </div>

        <button
          className="action primary"
          onClick={() => {
            setEditingData(null);
            setOpenModal(true);
          }}
        >
          + Penjualan Baru
        </button>

        <SalesModal
          open={openModal}
          data={editingData}
          onClose={() => {
            setOpenModal(false);
            setEditingData(null);
            fetchData();
          }}
        />
      </div>

      {/* ================= PERIODE ================= */}
      <div className="transaksi-period">
        <span>Periode:</span>
        <strong>
          {new Date(activeMonth + "-01").toLocaleDateString("id-ID", {
            month: "long",
            year: "numeric",
          })}
        </strong>

        <input
          type="month"
          value={activeMonth}
          onChange={e => setActiveMonth(e.target.value)}
        />
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="transaksi-summary">
        <div className="summary-card">
          <span>Total Transaksi</span>
          <strong>{summary.totalTransaksi}</strong>
        </div>

        <div className="summary-card info">
          <span>Status Transaksi</span>
          <strong>
            {summary.lunasCount} Lunas / {summary.belumCount} Belum
          </strong>
        </div>

        <div className="summary-card warning">
          <span>Total BON</span>
          <strong>
            Rp {summary.totalBON.toLocaleString("id-ID")}
          </strong>
        </div>

        <div className="summary-card success">
          <span>Total Lunas</span>
          <strong>
            Rp {summary.totalLunas.toLocaleString("id-ID")}
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

        <select
          value={metodeBayar}
          onChange={e => setMetodeBayar(e.target.value)}
        >
          <option value="">Semua Metode</option>
          <option value="Cash">Cash</option>
          <option value="Transfer">Transfer</option>
          <option value="QRIS">QRIS</option>
        </select>

        <select
          value={statusBayar}
          onChange={e => setStatusBayar(e.target.value)}
        >
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
              <td colSpan="7" className="empty">
                Tidak ada data
              </td>
            </tr>
          )}

          {filtered.map(row => (
            <tr key={row.id}>
              <td>{row.id}</td>
              <td>{formatTanggal(row.tanggal)}</td>
              <td>{row.namaPelanggan || "-"}</td>
              <td>{row.metodeBayar}</td>
              <td>
                <span
                  className={`status ${
                    statusClass[row.statusBayar] || ""
                  }`}
                >
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
