"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/styles/sidebar.css";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  return (
    <aside className="sidebar">
      {/* BRAND */}
      <div className="sidebar-brand">
        <div className="sidebar-logo">SIB</div>
        <div className="sidebar-store">
          SIB Service Center
          <span>Service & Penjualan</span>
        </div>
      </div>

      {/* MENU */}
      <nav className="sidebar-menu">
        <Link
          href="/"
          className={`menu-item ${isActive("/") ? "active" : ""}`}
        >
          Dashboard
        </Link>

        <Link
          href="/service"
          className={`menu-item ${isActive("/service") ? "active" : ""}`}
        >
          Service
        </Link>

        <Link
          href="/penjualan"
          className={`menu-item ${isActive("/penjualan") ? "active" : ""}`}
        >
          Penjualan
        </Link>

        {/* ===== MENU BARU: KEUANGAN ===== */}
        <Link
          href="/keuangan"
          className={`menu-item ${isActive("/keuangan") ? "active" : ""}`}
        >
          Keuangan
        </Link>

        <Link
          href="/master"
          className={`menu-item ${isActive("/master") ? "active" : ""}`}
        >
          Master Data
        </Link>
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="sidebar-logout">Logout</div>
      </div>
    </aside>
  );
}
