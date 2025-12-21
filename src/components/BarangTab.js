"use client";

import { useEffect, useMemo, useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import { postAPI } from "@/lib/api";
import "@/styles/pages/dataBarang.css";

export default function DataBarangPage() {
  const [barangList, setBarangList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);

  // ===============================
  // FILTER STATE
  // ===============================
  const [search, setSearch] = useState("");
  const [kategori, setKategori] = useState("");
  const [status, setStatus] = useState("");

  async function loadBarang() {
    try {
      setLoading(true);
      setError("");

      const res = await postAPI("barang");

      if (res.status !== "OK") {
        throw new Error("Gagal memuat data barang");
      }

      setBarangList(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBarang();
  }, []);

  // ===============================
  // LIST KATEGORI (UNIK)
  // ===============================
  const kategoriOptions = useMemo(() => {
    return [...new Set(barangList.map(b => b.kategori).filter(Boolean))];
  }, [barangList]);

  // ===============================
  // FILTERED DATA (REALTIME)
  // ===============================
  const filteredBarang = useMemo(() => {
    return barangList.filter(item => {
      const keyword = search.toLowerCase();

      const matchSearch =
        !search ||
        item.nama?.toLowerCase().includes(keyword) ||
        item.sku?.toLowerCase().includes(keyword) ||
        item.id?.toLowerCase().includes(keyword);

      const matchKategori =
        !kategori || item.kategori === kategori;

      const matchStatus =
        !status || item.status === status;

      return matchSearch && matchKategori && matchStatus;
    });
  }, [barangList, search, kategori, status]);

  return (
    <>
      <ContainerCard>

        {/* ================= PAGE HEADER ================= */}
        <div className="dashboard-header">
          <div>
            <h2>Data Barang</h2>
            <p>Master sparepart & item fisik untuk service dan penjualan</p>
          </div>

          <div className="dashboard-actions">
            <button
              className="action primary"
              onClick={() => setOpenForm(true)}
            >
              + Tambah Barang
            </button>
          </div>
        </div>

        {/* ================= FILTER ================= */}
        <div className="dashboard-section">
          <div className="databarang-filter">

            <div className="filter-search">
              <input
                type="text"
                placeholder="Cari barang (nama / SKU)"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="filter-select">
              <select
                value={kategori}
                onChange={(e) => setKategori(e.target.value)}
              >
                <option value="">Semua Kategori</option>
                {kategoriOptions.map(k => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="">Semua Status</option>
                <option value="AKTIF">AKTIF</option>
                <option value="NONAKTIF">NONAKTIF</option>
              </select>
            </div>
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="dashboard-section">
          <h3>Daftar Barang</h3>

          {loading && <p className="muted">Memuat data...</p>}
          {error && <p className="text-error">{error}</p>}

          {!loading && !error && (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Barang</th>
                  <th>Kategori</th>
                  <th>Supplier</th>
                  <th>Stok</th>
                  <th>Harga Jual</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredBarang.map((item, index) => (
                  <tr key={item.id || item.sku || index}>
                    <td>
                      <strong>{item.nama}</strong>
                      <br />
                      <small>{item.sku || item.id}</small>
                    </td>
                    <td>{item.kategori}</td>
                    <td>{item.supplier}</td>
                    <td>
                      <div>{item.qty}</div>
                      <small>{item.satuan}</small>
                    </td>
                    <td>
                      Rp {Number(item.hargaJual || 0).toLocaleString("id-ID")}
                    </td>
                    <td>
                      <span className={`status ${item.status === "AKTIF" ? "success" : "default"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" title="Detail">👁</button>
                        <button className="icon-btn" title="Edit">✎</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredBarang.length === 0 && (
                  <tr>
                    <td colSpan="7" className="text-center muted">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

      </ContainerCard>

      {/* ================= MODAL ================= */}
      {openForm && (
        <div className="modal-backdrop">
          <div className="modal-container large">
            <div className="modal-header">
              <h3>Tambah Barang</h3>
              <button onClick={() => setOpenForm(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p className="muted">
                Form akan kita lengkapi setelah endpoint CRUD siap
              </p>
            </div>

            <div className="modal-footer">
              <button className="action" onClick={() => setOpenForm(false)}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
