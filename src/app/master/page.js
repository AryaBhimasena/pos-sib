"use client";

import { useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import BarangTab from "@/components/BarangTab";
import PelangganTab from "@/components/PelangganTab";
import SupplierTab from "@/components/SupplierTab";
import "@/styles/pages/master.css";

/* ===== MAIN PAGE ===== */
export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState("barang");

  function renderTab() {
    switch (activeTab) {
      case "pelanggan":
        return <PelangganTab />;
      case "supplier":
        return <SupplierTab />;
      default:
        return <BarangTab />;
    }
  }

  return (
    <ContainerCard>

      {/* ================= PAGE HEADER ================= */}
      <div className="dashboard-header">
        <div>
          <h2>Master Data</h2>
          <p>Pengelolaan data utama untuk operasional outlet</p>
        </div>
      </div>

      {/* ================= TAB NAV ================= */}
      <div className="master-tabs">
        <button
          className={`tab-btn ${activeTab === "pelanggan" ? "active" : ""}`}
          onClick={() => setActiveTab("pelanggan")}
        >
          Data Pelanggan
        </button>

        <button
          className={`tab-btn ${activeTab === "barang" ? "active" : ""}`}
          onClick={() => setActiveTab("barang")}
        >
          Data Barang
        </button>

        <button
          className={`tab-btn ${activeTab === "supplier" ? "active" : ""}`}
          onClick={() => setActiveTab("supplier")}
        >
          Data Supplier
        </button>
      </div>

      {/* ================= TAB BODY ================= */}
      <div className="master-tab-body">
        {renderTab()}
      </div>

    </ContainerCard>
  );
}
