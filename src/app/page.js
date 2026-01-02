"use client";

import { useState, useEffect } from "react";
import ContainerCard from "@/components/ContainerCard";
import ServiceModal from "@/components/ServiceModal";
import {
  fetchDashboardService,
  fetchDashboardBarang,
  filterBarang,
  formatTanggal,
} from "@/lib/dashboardHelper";
import PettyCashModal from "@/components/pettyCashModal";
import SalesModal from "@/components/penjualan/SalesModal";

export default function DashboardPage() {
  const [openService, setOpenService] = useState(false);
  const [serviceList, setServiceList] = useState([]);
  const [serviceByTeknisi, setServiceByTeknisi] = useState([]);
  const [openSalesModal, setOpenSalesModal] = useState(false);

  // ===============================
  // STATE UNTUK MODE CREATE / EDIT SERVICE
  // ===============================
  const [selectedService, setSelectedService] = useState(null);

  // ===============================
  // PETTY CASH STATE (HARIAN)
  // ===============================
  const [openPettyCash, setOpenPettyCash] = useState(false);
  const [pettyCashValue, setPettyCashValue] = useState("");
  const [pettyCashTanggal, setPettyCashTanggal] = useState(
    new Date().toDateString()
  );

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
    fetchDashboardService({
      setServiceList,
      setKpiServiceDiterima,
      setServiceByTeknisi,
    });

    fetchDashboardBarang({
      setBarangList,
    });
  }, []);

  // ===============================
  // RESET PETTY CASH SAAT GANTI TANGGAL
  // ===============================
  useEffect(() => {
    const today = new Date().toDateString();

    if (pettyCashTanggal !== today) {
      setPettyCashTanggal(today);
      setPettyCashValue("");
    }
  }, [pettyCashTanggal]);

  // ===============================
  // FILTER BARANG (UNTUK DROPDOWN)
  // ===============================
  const filteredBarang = filterBarang(barangList, searchBarang);

  // ===============================
  // SUBMIT PETTY CASH (LOCAL ONLY)
  // ===============================
  function submitPettyCash() {
    const nominal = Number(pettyCashValue || 0);
    if (!nominal || nominal <= 0) return;

    setKpiKasToko(prev => prev + nominal);
    setKpiOmzet(prev => prev + nominal);

    setPettyCashValue("");
    setOpenPettyCash(false);
  }

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
              onClick={() => {
                setSelectedService(null);
                setOpenService(true);
              }}
            >
              + Service Baru
            </button>

			<button
			  className="action"
			  onClick={() => setOpenSalesModal(true)}
			>
			  + Penjualan
			</button>

            <button
              className="action success"
              onClick={() => setOpenPettyCash(true)}
            >
              + Petty Cash
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
                <th>Aksi</th>
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
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    Tidak ada service diterima
                  </td>
                </tr>
              )}

              {serviceList.map(s => (
                <tr key={s.id}>
                  <td>
                    <button
                      className="icon-button"
                      title="Lihat / Edit Nota"
                      onClick={() => {
                        setSelectedService(s); // EDIT MODE
                        setOpenService(true);
                      }}
                    >
                      ✏️
                    </button>
                  </td>

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

      {/* ================================================= */}
      {/* MODAL PETTY CASH (SIMPLE) */}
      {/* ================================================= */}
		<PettyCashModal
		  open={openPettyCash}
		  value={pettyCashValue}
		  onChange={setPettyCashValue}
		  onClose={() => setOpenPettyCash(false)}
		  onSubmit={submitPettyCash}
		/>

      <ServiceModal
        open={openService}
        onClose={() => {
          setOpenService(false);
          setSelectedService(null);
        }}
        serviceData={selectedService}
        mode={selectedService ? "edit" : "create"}
      />
	  
		<SalesModal
		  open={openSalesModal}
		  onClose={() => setOpenSalesModal(false)}
		/>
    </>
  );
}
