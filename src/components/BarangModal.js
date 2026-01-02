"use client";

import { useEffect, useState } from "react";
import "@/styles/form/barang-modal.css";

export default function BarangModal({ open, onClose }) {
  const [form, setForm] = useState({
    NamaBarang: "",
    SKU: "",
    Kategori: "",
    MerekPart: "",
    MerekHP: "",
    Supplier: "",
    Stock: 1,
    HargaBeli: "",
    HargaJual: "",
    LokasiStock: "",
  });

  useEffect(() => {
    if (!open) return;

    setForm({
      NamaBarang: "",
      SKU: "",
      Kategori: "",
      MerekPart: "",
      MerekHP: "",
      Supplier: "",
      Stock: 1,
      HargaBeli: "",
      HargaJual: "",
      LokasiStock: "",
    });
  }, [open]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = e => {
    e.preventDefault();

    console.log("SUBMIT BARANG:", {
      ...form,
      Status: "TERSEDIA",
    });

    onClose();
  };

  if (!open) return null;

  return (
    <div className="barang-modal-backdrop">
      <div className="barang-modal">

        {/* ================= HEADER ================= */}
        <div className="barang-modal-header">
          <div>
            <h3>Tambah Barang</h3>
            <p>Master data barang & sparepart</p>
          </div>
          <button className="close" onClick={onClose}>×</button>
        </div>

        {/* ================= BODY ================= */}
        <form className="barang-modal-body" onSubmit={handleSubmit}>

          {/* ===== INFORMASI UTAMA ===== */}
{/* ===== INFORMASI BARANG ===== */}
<div className="section">
  <h4>Informasi Barang</h4>

  {/* Nama Barang - FULL */}
  <div className="field">
    <label>Nama Barang</label>
    <input
      name="NamaBarang"
      value={form.NamaBarang}
      onChange={handleChange}
      required
    />
  </div>

  {/* Kategori & SKU (kategori dulu) */}
  <div className="grid two">
    <div className="field">
      <label>Kategori</label>
      <input
        name="Kategori"
        value={form.Kategori}
        onChange={handleChange}
        required
      />
    </div>

    <div className="field">
      <label>SKU <span>(Opsional)</span></label>
      <input
        name="SKU"
        value={form.SKU}
        onChange={handleChange}
      />
    </div>
  </div>

  {/* Merek */}
  <div className="grid two">
    <div className="field">
      <label>Merek Part</label>
      <input
        name="MerekPart"
        value={form.MerekPart}
        onChange={handleChange}
        required
      />
    </div>

    <div className="field">
      <label>Merek HP</label>
      <input
        name="MerekHP"
        value={form.MerekHP}
        onChange={handleChange}
        required
      />
    </div>
  </div>

  {/* Lokasi, Stock, Supplier */}
  <div className="grid three">
    <div className="field">
      <label>Lokasi Stok</label>
      <input
        name="LokasiStock"
        value={form.LokasiStock}
        onChange={handleChange}
        required
      />
    </div>

    <div className="field">
      <label>Stock Awal</label>
      <input
        type="number"
        name="Stock"
        min="1"
        value={form.Stock}
        onChange={handleChange}
        required
      />
    </div>

    <div className="field">
      <label>Supplier</label>
      <input
        name="Supplier"
        value={form.Supplier}
        onChange={handleChange}
        required
      />
    </div>
  </div>
</div>

{/* ===== INFORMASI HARGA ===== */}
<div className="section highlight">
  <h4>Informasi Harga</h4>

  <div className="grid two">
    <div className="field">
      <label>Harga Beli</label>
      <input
        type="number"
        name="HargaBeli"
        value={form.HargaBeli}
        onChange={handleChange}
        required
      />
    </div>

    <div className="field">
      <label>Harga Jual</label>
      <input
        type="number"
        name="HargaJual"
        value={form.HargaJual}
        onChange={handleChange}
        required
      />
    </div>
  </div>
</div>


        </form>

        {/* ================= FOOTER ================= */}
        <div className="barang-modal-footer">
          <button type="button" className="btn ghost" onClick={onClose}>
            Batal
          </button>
          <button type="submit" className="btn primary" onClick={handleSubmit}>
            Simpan Barang
          </button>
        </div>

      </div>
    </div>
  );
}
