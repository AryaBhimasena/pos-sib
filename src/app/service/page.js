/* ======================================================
   PAGE SERVICE
   Lokasi: app/service/page.js
====================================================== */

"use client";

import { useEffect, useMemo, useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import { postAPI } from "@/lib/api";
import "@/styles/pages/service.css";

export default function TransaksiServicePage() {
  const [list, setList] = useState([]);
  const [bulan, setBulan] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });

  const [search, setSearch] = useState("");
  const [statusService, setStatusService] = useState("");
  const [statusBayar, setStatusBayar] = useState("");

  const fetchData = async () => {
    try {
      const json = await postAPI("apiGetTransaksiService");

      if (json.status === "OK") {
        setList(Array.isArray(json.data) ? json.data : []);
      }
    } catch (err) {
      console.error("FETCH SERVICE ERROR:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [bulan]);

  const filtered = useMemo(() => {
    if (!Array.isArray(list)) return [];

    return list.filter(r => {
      if (statusService && r.statusService !== statusService) return false;
      if (statusBayar && r.statusBayar !== statusBayar) return false;
      if (
        search &&
        !`${r.id} ${r.pelanggan}`.toLowerCase().includes(search.toLowerCase())
      ) return false;
      return true;
    });
  }, [list, search, statusService, statusBayar]);

  const summary = useMemo(() => {
    return {
      total: filtered.length,
      selesai: filtered.filter(r => r.statusService === "SELESAI").length,
      belumBayar: filtered.filter(r => r.statusBayar !== "LUNAS").length,
      omzet: filtered.reduce((a, b) => a + (b.grandTotal || 0), 0),
    };
  }, [filtered]);

  return (
    <ContainerCard>
      {/* ================= HEADER ================= */}
      <div className="transaksi-header">
        <div>
          <h2>Transaksi Service</h2>
          <p>Monitoring dan kontrol seluruh service per periode</p>
        </div>

        <div className="transaksi-filter">
          <input
            type="month"
            value={bulan}
            onChange={e => setBulan(e.target.value)}
          />
        </div>
      </div>

      {/* ================= SUMMARY ================= */}
      <div className="transaksi-summary">
        <div className="summary-card">
          <span>Total Service</span>
          <strong>{summary.total}</strong>
        </div>
        <div className="summary-card success">
          <span>Selesai</span>
          <strong>{summary.selesai}</strong>
        </div>
        <div className="summary-card warning">
          <span>Belum Lunas</span>
          <strong>{summary.belumBayar}</strong>
        </div>
        <div className="summary-card primary">
          <span>Omzet</span>
          <strong>
            Rp {summary.omzet.toLocaleString("id-ID")}
          </strong>
        </div>
      </div>

      {/* ================= FILTER BAR ================= */}
      <div className="transaksi-toolbar">
        <input
          placeholder="Cari nota / pelanggan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />

        <select
          value={statusService}
          onChange={e => setStatusService(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="DITERIMA">Diterima</option>
          <option value="DIPROSES">Diproses</option>
          <option value="SELESAI">Selesai</option>
        </select>

        <select
          value={statusBayar}
          onChange={e => setStatusBayar(e.target.value)}
        >
          <option value="">Semua Pembayaran</option>
          <option value="LUNAS">Lunas</option>
          <option value="BELUM LUNAS">Belum Lunas</option>
        </select>
      </div>

      {/* ================= TABLE ================= */}
      <div className="transaksi-table-wrapper">
        <table className="transaksi-table">
          <thead>
            <tr>
              <th>No Nota</th>
              <th>Tanggal</th>
              <th>Pelanggan</th>
              <th>Perangkat</th>
              <th>Teknisi</th>
              <th>Status</th>
              <th>Total</th>
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
                <td>{row.tanggalTerima}</td>
                <td>{row.pelanggan}</td>
                <td>{row.merekHP} {row.typeHP}</td>
                <td>{row.teknisi}</td>
                <td>
                  <span className={`status ${row.statusService}`}>
                    {row.statusService}
                  </span>
                </td>
                <td className="right">
                  Rp {Number(row.grandTotal || 0).toLocaleString("id-ID")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </ContainerCard>
  );
}
