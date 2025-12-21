"use client";

import { useEffect, useMemo, useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import { postAPI } from "@/lib/api";
import "@/styles/pages/pelanggan.css";

export default function PelangganTab() {
  const [pelangganList, setPelangganList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);

  /* ================= FILTER ================= */
  const [search, setSearch] = useState("");

  async function loadPelanggan() {
    try {
      setLoading(true);
      setError("");

      const res = await postAPI("pelanggan");

      if (res.status !== "OK") {
        throw new Error("Gagal memuat data pelanggan");
      }

      setPelangganList(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPelanggan();
  }, []);

  /* ================= FILTERED DATA ================= */
  const filteredPelanggan = useMemo(() => {
    const keyword = search.toLowerCase().trim();

    if (!keyword) return pelangganList;

    return pelangganList.filter(item => {
      const nama = String(item.nama || "").toLowerCase();
      const nohp = String(item.nohp || "").toLowerCase();
      const id   = String(item.id || "").toLowerCase();

      return (
        nama.includes(keyword) ||
        nohp.includes(keyword) ||
        id.includes(keyword)
      );
    });
  }, [pelangganList, search]);

  return (
    <>
      <ContainerCard>

        {/* ================= PAGE HEADER ================= */}
        <div className="dashboard-header">
          <div>
            <h2>Data Pelanggan</h2>
            <p>Master data pelanggan untuk transaksi service & penjualan</p>
          </div>

          <div className="dashboard-actions">
            <button
              className="action primary"
              onClick={() => setOpenForm(true)}
            >
              + Tambah Pelanggan
            </button>
          </div>
        </div>

        {/* ================= FILTER ================= */}
        <div className="dashboard-section">
          <div className="pelanggan-filter">
            <input
              type="text"
              placeholder="Cari pelanggan (nama / no HP)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* ================= TABLE ================= */}
        <div className="dashboard-section">
          <h3>Daftar Pelanggan</h3>

          {loading && <p className="muted">Memuat data...</p>}
          {error && <p className="text-error">{error}</p>}

          {!loading && !error && (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Pelanggan</th>
                  <th>No HP</th>
                  <th>Tanggal Daftar</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredPelanggan.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>
                      <strong>{item.nama}</strong>
                      <br />
                      <small>{item.id}</small>
                    </td>
                    <td>{item.nohp}</td>
                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("id-ID")
                        : "-"}
                    </td>
                    <td>
                      <div className="table-actions">
                        <button className="icon-btn" title="Detail">👁</button>
                        <button className="icon-btn" title="Edit">✎</button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredPelanggan.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center muted">
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
          <div className="modal-container">
            <div className="modal-header">
              <h3>Tambah Pelanggan</h3>
              <button onClick={() => setOpenForm(false)}>✕</button>
            </div>

            <div className="modal-body">
              <p className="muted">
                Form pelanggan akan dilengkapi setelah endpoint CRUD siap.
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
