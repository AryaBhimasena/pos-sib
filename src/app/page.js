"use client";

import { useState, useEffect } from "react";
import ContainerCard from "@/components/ContainerCard";
import ServiceModal from "@/components/ServiceModal";
import { postAPI } from "@/lib/api";

export default function DashboardPage() {
  const [openService, setOpenService] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [serviceByTeknisi, setServiceByTeknisi] = useState([]);

  // KPI STATE
  const [kpiServiceDiterima, setKpiServiceDiterima] = useState(0);
  const [kpiKasToko, setKpiKasToko] = useState(3500000);
  const [kpiTransfer, setKpiTransfer] = useState(1250000);
  const [kpiOmzet, setKpiOmzet] = useState(4750000);

  // BARANG STATE (MASTER DATA)
  const [barangList, setBarangList] = useState([]);
  const [searchBarang, setSearchBarang] = useState("");
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    async function fetchService() {
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

    async function fetchBarang() {
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

    fetchService();
    fetchBarang();
  }, []);

  // ===============================
  // FILTER BARANG (UNTUK DROPDOWN)
  // ===============================
  const filteredBarang = Array.isArray(barangList)
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

  // ===============================
  // FORMAT TANGGAL dd-mm-yyyy
  // ===============================
  const formatTanggal = iso => {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "-";

    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();

    return `${dd}-${mm}-${yyyy}`;
  };

  return (
    <>
      <ContainerCard>

        {/* ================================================= */}
        {/* DASHBOARD HEADER + QUICK ACTION */}
        {/* ================================================= */}
        <div className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Ringkasan operasional & kontrol service hari ini</p>
          </div>

          <div className="dashboard-actions">
            <button
              className="action primary"
              onClick={() => setOpenService(true)}
            >
              + Service Baru
            </button>
            <button className="action">
              + Penjualan
            </button>
          </div>
        </div>

        {/* ================================================= */}
        {/* KPI CARDS */}
        {/* ================================================= */}
        <div className="dashboard-kpi">
          <div className="kpi-card service">
            <div className="kpi-content">
              <span className="kpi-label">Service Diterima</span>
              <strong className="kpi-value">{kpiServiceDiterima}</strong>
            </div>
          </div>

          <div className="kpi-card success">
            <div className="kpi-content">
              <span className="kpi-label">Saldo Kas Toko</span>
              <strong className="kpi-value">
                Rp {kpiKasToko.toLocaleString("id-ID")}
              </strong>
            </div>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-content">
              <span className="kpi-label">Pembayaran Transfer</span>
              <strong className="kpi-value">
                Rp {kpiTransfer.toLocaleString("id-ID")}
              </strong>
            </div>
          </div>

          <div className="kpi-card revenue">
            <div className="kpi-content">
              <span className="kpi-label">Total Omzet Hari Ini</span>
              <strong className="kpi-value">
                Rp {kpiOmzet.toLocaleString("id-ID")}
              </strong>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* REMINDER */}
        {/* ================================================= */}
        <div className="dashboard-reminder">
          <div className="reminder overdue">
            <div className="reminder-header">
              <strong>Service per Teknisi (Bulan Ini)</strong>
              <button className="link">Lihat Semua</button>
            </div>

            <ul className="reminder-list">
              {serviceByTeknisi.length === 0 && (
                <li>
                  <span className="nota">-</span>
                  <small>Tidak ada data</small>
                </li>
              )}

              {serviceByTeknisi.map(item => (
                <li key={item.nama}>
                  <span className="nota">{item.nama}</span>
                  <small>{item.total} Service</small>
                </li>
              ))}
            </ul>
          </div>

          <div className="reminder due">
            <div className="reminder-header">
              <strong>Pencarian Barang Cepat</strong>
            </div>

            <input
              type="text"
              placeholder="Cari barang (nama / SKU)"
              value={searchBarang}
              onChange={e => {
                setSearchBarang(e.target.value);
                setShowDropdown(true);
                setSelectedBarang(null);
              }}
              onBlur={() => setTimeout(() => setShowDropdown(false), 150)}
              style={{ marginBottom: 8 }}
            />

            {showDropdown && filteredBarang.length > 0 && (
              <ul className="dropdown-search">
                {filteredBarang.slice(0, 5).map(item => (
                  <li
                    key={item.id}
                    onClick={() => {
                      setSelectedBarang(item);
                      setSearchBarang(item.nama);
                      setShowDropdown(false);
                    }}
                  >
                    <strong>{item.nama}</strong>
                    <br />
                    <small>{item.sku || item.id}</small>
                  </li>
                ))}
              </ul>
            )}

            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Nama Barang</th>
                  <th>Stok</th>
                  <th>Harga</th>
                </tr>
              </thead>
              <tbody>
                {!selectedBarang && (
                  <tr>
                    <td colSpan="4" style={{ textAlign: "center" }}>
                      Pilih barang dari hasil pencarian
                    </td>
                  </tr>
                )}

                {selectedBarang && (
                  <tr>
                    <td>{selectedBarang.nama}</td>
                    <td>{selectedBarang.qty}</td>
                    <td>
                      Rp{" "}
                      {Number(selectedBarang.hargaJual || 0).toLocaleString(
                        "id-ID"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================= */}
        {/* TABLE SERVICE */}
        {/* ================================================= */}
        <div className="dashboard-section">
          <h3>Service Terbaru (Diterima)</h3>

          <table className="dashboard-table">
            <thead>
              <tr>
                <th>No Nota</th>
                <th>Pelanggan</th>
                <th>Perangkat</th>
                <th>Teknisi</th>
                <th>Estimasi</th>
                <th>Status</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {serviceList.length === 0 && (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center" }}>
                    Tidak ada service diterima
                  </td>
                </tr>
              )}

              {serviceList.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.pelanggan}</td>
                  <td>{s.merekHP} {s.typeHP}</td>
                  <td>{s.teknisi}</td>
                  <td>{formatTanggal(s.estimasiSelesai)}</td>
                  <td>
                    <span className="status info">{s.statusService}</span>
                  </td>
                  <td>
                    Rp {s.grandTotal.toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </ContainerCard>

      <ServiceModal
        open={openService}
        onClose={() => setOpenService(false)}
      />
    </>
  );
}
