"use client";

import { useEffect, useState } from "react";
import "@/styles/form/barang-modal.css";
import { fetchMasterDataBarang } from "@/lib/masterData";
import { postAPI } from "@/lib/api";

/* ================= INITIAL FORM ================= */
const initialForm = {
  NamaBarang: "",
  SKU: "",
  ID_KategoriBarang: "",
  ID_MerekPart: "",
  ID_MerekHP: "",
  ID_Supplier: "",
  ID_LokasiStock: "",
  Qty: 1,
  HargaBeli: "",
  HargaJual: "",
};

export default function BarangModal({ open, onClose, mode, data }) {
  /* ================= MASTER DATA ================= */
  const [master, setMaster] = useState({
    kategoriBarang: [],
    merekPart: [],
    merekHP: [],
    lokasiStock: [],
    supplier: [],
  });

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState(initialForm);

  /* ================= EFFECT ================= */
	useEffect(() => {
	  if (!open) return;

	  fetchMasterDataBarang().then(setMaster);

	  if (mode === "edit" && data) {
		setForm({
		  NamaBarang: data.nama || "",
		  SKU: data.sku || "",
		  ID_KategoriBarang: data.idKategori || "",
		  ID_MerekPart: data.idMerekPart || "",
		  ID_MerekHP: data.idMerekHP || "",
		  ID_Supplier: data.idSupplier || "",
		  ID_LokasiStock: data.idLokasi || "",
		  Qty: data.qty || 1,
		  HargaBeli: data.hargaBeli || "",
		  HargaJual: data.hargaJual || "",
		});
	  } else {
		setForm(initialForm);
	  }
	}, [open, mode, data]);

  /* ================= HANDLERS ================= */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const payload = {
      nama: form.NamaBarang,
      sku: form.SKU,
      idKategori: form.ID_KategoriBarang,
      idMerekPart: form.ID_MerekPart,
      idMerekHP: form.ID_MerekHP,
      idSupplier: form.ID_Supplier,
      idLokasi: form.ID_LokasiStock,
      qty: Number(form.Qty),
      satuan: "PCS",
      hargaBeli: Number(form.HargaBeli),
      hargaJual: Number(form.HargaJual),
      status: "AKTIF",
    };

    console.log("CREATE BARANG PAYLOAD:", payload);

    await postAPI("barang/create", payload);
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
          {/* ===== INFORMASI BARANG ===== */}
          <div className="section">
            <h4>Informasi Barang</h4>

            <div className="field">
              <label>Nama Barang</label>
              <input
                name="NamaBarang"
                value={form.NamaBarang}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid two">
              <div className="field">
                <label>Kategori</label>
                <select
                  name="ID_KategoriBarang"
                  value={form.ID_KategoriBarang}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Kategori --</option>
                  {master.kategoriBarang.map(k => (
                    <option key={k.ID_Kategori} value={k.ID_Kategori}>
                      {k.NamaKategori}
                    </option>
                  ))}
                </select>
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

            <div className="grid two">
              <div className="field">
                <label>Merek Part</label>
                <select
                  name="ID_MerekPart"
                  value={form.ID_MerekPart}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Merek Part --</option>
                  {master.merekPart.map(m => (
                    <option key={m.ID_MerekPart} value={m.ID_MerekPart}>
                      {m.NamaMerek} ({m.Kualitas})
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Merek HP</label>
                <select
                  name="ID_MerekHP"
                  value={form.ID_MerekHP}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Merek HP --</option>
                  {master.merekHP.map(m => (
                    <option key={m.ID_MerekHP} value={m.ID_MerekHP}>
                      {m.NamaMerek}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid three">
              <div className="field">
                <label>Lokasi Stok</label>
                <select
                  name="ID_LokasiStock"
                  value={form.ID_LokasiStock}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Lokasi --</option>
                  {master.lokasiStock.map(l => (
                    <option key={l.ID_LokasiStock} value={l.ID_LokasiStock}>
                      {l.Keterangan}
                    </option>
                  ))}
                </select>
              </div>

              <div className="field">
                <label>Stock Awal</label>
                <input
                  type="number"
                  name="Qty"
                  min="1"
                  value={form.Qty}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="field">
                <label>Supplier</label>
                <select
                  name="ID_Supplier"
                  value={form.ID_Supplier}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Pilih Supplier --</option>
                  {master.supplier.map(s => (
                    <option key={s.ID_Supplier} value={s.ID_Supplier}>
                      {s.NamaSupplier}
                    </option>
                  ))}
                </select>
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
			<button
			  type="submit"
			  className="btn primary"
			  disabled={mode === "edit"}
			  title={mode === "edit" ? "Mode preview (belum bisa simpan)" : ""}
			>
			  {mode === "edit" ? "Preview Barang" : "Simpan Barang"}
			</button>
        </div>
      </div>
    </div>
  );
}
