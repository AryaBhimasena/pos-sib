"use client";

import { useState } from "react";
import ContainerCard from "@/components/ContainerCard";

import PembayaranTeknisiTab from "@/components/keuangan/PembayaranTekhnisiTab";
import LedgerKeuanganTab from "@/components/keuangan/LedgerKeuanganTab";
import HutangSupplierTab from "@/components/keuangan/HutangSupplierTab";

import "@/styles/pages/keuangan.css";

export default function KeuanganPage() {
  const [activeTab, setActiveTab] = useState("teknisi");

  function renderTab() {
    switch (activeTab) {
      case "ledger":
        return <LedgerKeuanganTab />;
      case "supplier":
        return <HutangSupplierTab />;
      default:
        return <PembayaranTeknisiTab />;
    }
  }

  return (
    <ContainerCard>

      {/* ================= PAGE HEADER ================= */}
      <div className="dashboard-header">
        <div>
          <h2>Keuangan</h2>
          <p>Pengelolaan transaksi keuangan, kewajiban, dan pencatatan kas</p>
        </div>
      </div>

      {/* ================= TAB NAV ================= */}
      <div className="keuangan-tabs">
        <button
          className={`tab-btn ${activeTab === "teknisi" ? "active" : ""}`}
          onClick={() => setActiveTab("teknisi")}
        >
          Pembayaran Teknisi
        </button>

        <button
          className={`tab-btn ${activeTab === "ledger" ? "active" : ""}`}
          onClick={() => setActiveTab("ledger")}
        >
          Ledger Keuangan
        </button>

        <button
          className={`tab-btn ${activeTab === "supplier" ? "active" : ""}`}
          onClick={() => setActiveTab("supplier")}
        >
          Hutang Supplier
        </button>
      </div>

      {/* ================= TAB BODY ================= */}
      <div className="keuangan-tab-body">
        {renderTab()}
      </div>

    </ContainerCard>
  );
}
