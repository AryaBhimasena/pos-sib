/* ======================================================
   SUPPLIER MODAL
   Lokasi: src/components/SupplierModal.js
====================================================== */

"use client";

import { useEffect, useState } from "react";
import "@/styles/form/supplier-modal.css";
import { supplierAPI } from "@/lib/masterDataHelper";

export default function SupplierModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    namaSupplier: "",
    kontak: "",
    alamat: "",
    status: "AKTIF",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setForm({
      namaSupplier: "",
      kontak: "",
      alamat: "",
      status: "AKTIF",
    });
  }, [open]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (loading) return;

    try {
      setLoading(true);

      const payload = {
        nama: form.namaSupplier.trim(),
        kontak: form.kontak.trim(),
        alamat: form.alamat.trim(),
        status: form.status,
      };

      const res = await supplierAPI.create(payload);

      if (res.status !== "OK") {
        throw new Error(res.data?.message || "Gagal menyimpan supplier");
      }

      // optional: refresh data di parent
      onSuccess?.(res.data);

      onClose();
    } catch (err) {
      alert(err.message);
      console.error("CREATE SUPPLIER ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="supplier-modal-backdrop">
      <div className="supplier-modal">

        {/* ================= HEADER ================= */}
        <div className="supplier-modal-header">
          <div>
            <h3>Tambah Supplier</h3>
            <p>Data supplier untuk pembelian dan stok barang</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* ================= BODY ================= */}
        <form className="supplier-modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nama Supplier</label>
            <input
              name="namaSupplier"
              value={form.namaSupplier}
              onChange={handleChange}
              placeholder="Nama perusahaan / toko supplier"
              required
            />
          </div>

          <div className="field">
            <label>Kontak</label>
            <input
              name="kontak"
              value={form.kontak}
              onChange={handleChange}
              placeholder="No HP / Telepon / Email"
              required
            />
          </div>

          <div className="field">
            <label>Alamat</label>
            <textarea
              name="alamat"
              value={form.alamat}
              onChange={handleChange}
              placeholder="Alamat lengkap supplier"
              rows="3"
            />
          </div>

          <div className="field">
            <label>Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="AKTIF">Aktif</option>
              <option value="NONAKTIF">Non Aktif</option>
            </select>
          </div>
        </form>

        {/* ================= FOOTER ================= */}
        <div className="supplier-modal-footer">
          <button
            type="button"
            className="btn ghost"
            onClick={onClose}
            disabled={loading}
          >
            Batal
          </button>

          <button
            type="button"
            className="btn primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan Supplier"}
          </button>
        </div>

      </div>
    </div>
  );
}
