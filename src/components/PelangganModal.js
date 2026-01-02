/* ======================================================
   PELANGGAN MODAL
   Lokasi: src/components/PelangganModal.js
====================================================== */
"use client";

import { useEffect, useState } from "react";
import "@/styles/form/pelanggan-modal.css";
import { pelangganAPI } from "@/lib/masterDataHelper";

export default function PelangganModal({ open, onClose, onSuccess }) {
  const [form, setForm] = useState({
    nama: "",
    nohp: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    setForm({
      nama: "",
      nohp: "",
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
        nama: form.nama.trim(),
        nohp: form.nohp.trim(),
      };

      const res = await pelangganAPI.create(payload);

      if (res.status !== "OK") {
        throw new Error(res.data?.message || "Gagal menyimpan pelanggan");
      }

      // optional: refresh list di parent
      onSuccess?.(res.data);

      onClose();
    } catch (err) {
      alert(err.message);
      console.error("CREATE PELANGGAN ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="pelanggan-modal-backdrop">
      <div className="pelanggan-modal">

        {/* ================= HEADER ================= */}
        <div className="pelanggan-modal-header">
          <div>
            <h3>Tambah Pelanggan</h3>
            <p>Isi data pelanggan untuk transaksi service & penjualan</p>
          </div>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        {/* ================= BODY ================= */}
        <form className="pelanggan-modal-body" onSubmit={handleSubmit}>
          <div className="field">
            <label>Nama Pelanggan</label>
            <input
              name="nama"
              value={form.nama}
              onChange={handleChange}
              placeholder="Nama lengkap pelanggan"
              required
            />
          </div>

          <div className="field">
            <label>No HP</label>
            <input
              name="nohp"
              value={form.nohp}
              onChange={handleChange}
              placeholder="08xxxxxxxxxx"
              required
            />
          </div>
        </form>

        {/* ================= FOOTER ================= */}
        <div className="pelanggan-modal-footer">
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
            {loading ? "Menyimpan..." : "Simpan Pelanggan"}
          </button>
        </div>

      </div>
    </div>
  );
}
