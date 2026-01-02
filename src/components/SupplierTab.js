"use client";

import { useEffect, useMemo, useState } from "react";
import ContainerCard from "@/components/ContainerCard";
import { postAPI } from "@/lib/api";
import "@/styles/pages/supplier.css";
import SupplierModal from "@/components/SupplierModal";
import { supplierAPI } from "@/lib/masterDataHelper";

export default function SupplierTab() {
  const [supplierList, setSupplierList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);
  const handleSuccessCreate = () => {
  loadSupplier();       // re-fetch data
};

  /* ================= FILTER ================= */
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  async function loadSupplier() {
    try {
      setLoading(true);
      setError("");

      const res = await postAPI("supplier");

      if (res.status !== "OK") {
        throw new Error("Gagal memuat data supplier");
      }

      setSupplierList(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSupplier();
  }, []);

  /* ================= FILTERED DATA ================= */
  const filteredSupplier = useMemo(() => {
    const keyword = search.toLowerCase();

    return supplierList.filter(item => {
      const matchSearch =
        !search ||
        item.nama?.toLowerCase().includes(keyword) ||
        item.kontak?.toLowerCase().includes(keyword);

      const matchStatus =
        !status || item.status === status;

      return matchSearch && matchStatus;
    });
  }, [supplierList, search, status]);
  
  /* ================= DELETE DATA ================= */
async function handleDelete(id) {
  const ok = confirm("Yakin ingin menghapus supplier ini?");
  if (!ok) return;

  try {
    setLoading(true);
    setError("");

    const res = await supplierAPI.delete(id);

    if (res.status !== "OK") {
      throw new Error(res.message || "Gagal menghapus supplier");
    }

    await loadSupplier(); // refresh data
  } catch (err) {
    console.error(err);
    setError(err.message || "Terjadi kesalahan saat menghapus");
  } finally {
    setLoading(false);
  }
}

  return (
    <>
      <ContainerCard>

        {/* ================= PAGE HEADER ================= */}
        <div className="dashboard-header">
          <div>
            <h2>Data Supplier</h2>
            <p>Master data supplier sparepart & kebutuhan operasional</p>
          </div>

          <div className="dashboard-actions">
            <button
              className="action primary"
              onClick={() => setOpenForm(true)}
            >
              + Tambah Supplier
            </button>
          </div>
        </div>

        {/* ================= FILTER ================= */}
        <div className="dashboard-section">
          <div className="supplier-filter">

            <input
              type="text"
              placeholder="Cari supplier (nama / kontak)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

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

        {/* ================= TABLE ================= */}
        <div className="dashboard-section">
          <h3>Daftar Supplier</h3>

          {loading && <p className="muted">Memuat data...</p>}
          {error && <p className="text-error">{error}</p>}

          {!loading && !error && (
            <table className="dashboard-table">
              <thead>
                <tr>
                  <th>Supplier</th>
                  <th>Kontak</th>
                  <th>Alamat</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>

              <tbody>
                {filteredSupplier.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>
                      <strong>{item.nama}</strong>
                      <br />
                      <small>{item.id}</small>
                    </td>
                    <td>{item.kontak || "-"}</td>
                    <td className="truncate">{item.alamat || "-"}</td>
                    <td>
                      <span className={`status ${item.status === "AKTIF" ? "success" : "default"}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
<div className="table-actions">
  <button
    className="icon-btn danger"
    title="Hapus"
    onClick={() => handleDelete(item.id)}
  >
    🗑
  </button>
</div>
                    </td>
                  </tr>
                ))}

                {filteredSupplier.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center muted">
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
		<SupplierModal
		  open={openForm}
		  onClose={() => setOpenForm(false)}
		  onSuccess={handleSuccessCreate}
		/>
    </>
  );
}
