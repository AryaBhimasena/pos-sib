"use client";

import { useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import ServiceModal from "@/components/ServiceModal";

export default function DashboardPage() {
  const [openService, setOpenService] = useState(false);

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
              <span className="kpi-label">Service Masuk</span>
              <strong className="kpi-value">12</strong>
            </div>
          </div>

          <div className="kpi-card warning">
            <div className="kpi-content">
              <span className="kpi-label">Sedang Diproses</span>
              <strong className="kpi-value">5</strong>
            </div>
          </div>

          <div className="kpi-card success">
            <div className="kpi-content">
              <span className="kpi-label">Selesai</span>
              <strong className="kpi-value">7</strong>
            </div>
          </div>

          <div className="kpi-card revenue">
            <div className="kpi-content">
              <span className="kpi-label">Pendapatan Hari Ini</span>
              <strong className="kpi-value">Rp 2.450.000</strong>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* REMINDER */}
        {/* ================================================= */}
        <div className="dashboard-reminder">
          <div className="reminder overdue">
            <div className="reminder-header">
              <strong>Service Overdue</strong>
              <button className="link">Lihat Semua</button>
            </div>

            <ul className="reminder-list">
              <li>
                <span className="nota">SV-00121</span>
                <small>Estimasi 10 Sep 2025</small>
              </li>
              <li>
                <span className="nota">SV-00118</span>
                <small>Estimasi 09 Sep 2025</small>
              </li>
            </ul>
          </div>

          <div className="reminder due">
            <div className="reminder-header">
              <strong>Jatuh Tempo</strong>
              <button className="link">Lihat</button>
            </div>

            <ul className="reminder-list">
              <li>
                <span className="nota">SV-00122</span>
                <small>Hari Ini</small>
              </li>
              <li>
                <span className="nota">SV-00123</span>
                <small>Besok</small>
              </li>
            </ul>
          </div>
        </div>

        {/* ================================================= */}
        {/* TABLE */}
        {/* ================================================= */}
        <div className="dashboard-section">
          <h3>Service Aktif</h3>

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
              <tr className="row-overdue">
                <td>SV-00121</td>
                <td>Rina</td>
                <td>iPhone 11</td>
                <td>Agus</td>
                <td>10 Sep 2025</td>
                <td><span className="status danger">Overdue</span></td>
                <td>Rp 450.000</td>
              </tr>

              <tr>
                <td>SV-00122</td>
                <td>Budi</td>
                <td>Samsung A51</td>
                <td>Doni</td>
                <td>Hari Ini</td>
                <td><span className="status warning">Diproses</span></td>
                <td>Rp 300.000</td>
              </tr>

              <tr>
                <td>SV-00123</td>
                <td>Siti</td>
                <td>Xiaomi Note 10</td>
                <td>Agus</td>
                <td>Besok</td>
                <td><span className="status info">Diterima</span></td>
                <td>Rp 0</td>
              </tr>
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
