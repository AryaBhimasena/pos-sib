import "../styles/components.css";

export default function Sidebar() {
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
        <div className="menu-item active">Dashboard</div>

        <div className="menu-section">
          <div className="menu-parent">Transaksi</div>
          <div className="menu-group">
            <div className="menu-child">Service</div>
            <div className="menu-child">Penjualan</div>
          </div>
        </div>

        <div className="menu-section">
          <div className="menu-parent">Inventori</div>
          <div className="menu-group">
            <div className="menu-child">Mutasi Stok</div>
          </div>
        </div>

        <div className="menu-item">Laporan</div>

        <div className="menu-section">
          <div className="menu-parent">Master Data</div>
          <div className="menu-group">
            <div className="menu-child">Data Pelanggan</div>
            <div className="menu-child">Data Barang</div>
            <div className="menu-child">Data Supplier</div>
          </div>
        </div>
      </nav>

      {/* FOOTER */}
      <div className="sidebar-footer">
        <div className="sidebar-logout">Logout</div>
      </div>
    </aside>
  );
}
