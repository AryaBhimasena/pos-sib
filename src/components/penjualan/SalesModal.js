/* ======================================================
   SALES MODAL
   Lokasi: src/components/penjualan/SalesModal.js
====================================================== */
"use client";

import { useEffect, useMemo, useState } from "react";
import "@/styles/sales-modal.css";
import {
  initPenjualanModal,
  submitPenjualan,
  loadDetailBarang,
} from "@/lib/penjualan/penjualanModalHelper";

export default function SalesModal({ open, onClose, data }) {
  const [form, setForm] = useState({
    noNota: "",
    tanggal: "",
    namaPelanggan: "",
    metodeBayar: "Tunai",
    statusBayar: "Lunas",
  });

  const [barangList, setBarangList] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [items, setItems] = useState([]);
  const [searchBarang, setSearchBarang] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  

  /* ================= INIT MODAL ================= */
useEffect(() => {
  if (!open) return;

  if (data) {
    // MODE EDIT
    loadDetailBarang(data.id).then(res => {
      const { header, items } = res;

      setForm({
        noNota: header.ID_Penjualan,
        tanggal: header.Tanggal,
        namaPelanggan: header.NamaPelanggan,
        metodeBayar: header.MetodeBayar,
        statusBayar: header.StatusBayar,
      });

      setItems(
        items.map(it => ({
          idBarang: it.ID_Barang,
          namaBarang: it.NamaBarang,
          harga: Number(it.Harga),
        }))
      );
    });

    // tetap load master barang agar bisa tambah item
    initPenjualanModal(data.tanggal).then(res => {
      setBarangList(res.barangList);
    });
  } else {
    // MODE CREATE
    const today = new Date().toISOString().split("T")[0];

    setItems([]);
    setSearchBarang("");
    setSelectedBarang(null);

    initPenjualanModal(today).then(res => {
      setForm(f => ({
        ...f,
        tanggal: today,
        noNota: res.noNota,
      }));
      setBarangList(res.barangList);
    });
  }
}, [open, data]);

  /* ================= COMPUTED ================= */
  const totalItem = items.length;

  const totalHarga = useMemo(
    () => items.reduce((a, b) => a + Number(b.harga || 0), 0),
    [items]
  );

  const filteredBarang = useMemo(() => {
    if (!searchBarang) return barangList;

    const q = searchBarang.toLowerCase();
    return barangList.filter(
      b =>
        b.namaBarang?.toLowerCase().includes(q) ||
        String(b.sku || "").toLowerCase().includes(q)
    );
  }, [searchBarang, barangList]);

  /* ================= HANDLER ================= */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const addBarang = () => {
    if (!selectedBarang) return;

    setItems(i => [
      ...i,
      {
        idBarang: selectedBarang.id,
        namaBarang: selectedBarang.namaBarang,
        harga: selectedBarang.hargaJual,
      },
    ]);

    setSelectedBarang(null);
    setSearchBarang("");
    setShowDropdown(false);
  };

  const removeBarang = idx => {
    setItems(i => i.filter((_, i2) => i2 !== idx));
  };

const handleSubmit = async e => {
  e.preventDefault();

  if (items.length === 0) {
    alert("Barang belum ditambahkan");
    return;
  }

  const body = {
    noNota: form.noNota,
    tanggal: form.tanggal,
    namaPelanggan: form.namaPelanggan || "",
    metodeBayar: form.metodeBayar || "Tunai",
    statusBayar: form.statusBayar || "Lunas",
    totalItem: items.length,
    totalHarga: totalHarga,
    items: items.map(it => ({
      idBarang: it.idBarang,
      namaBarang: it.namaBarang,
      harga: Number(it.harga),
    })),
  };

  try {
    await submitPenjualan(body);
    alert("Transaksi penjualan berhasil disimpan");
    onClose();
  } catch (err) {
    alert(err.message || String(err));
  }
};

  if (!open) return null;

  return (
    <div className="sales-modal-backdrop">
      <div className="sales-modal fixed">
        {/* HEADER */}
        <div className="modal-header">
          <h3>Penjualan Baru</h3>
          <button className="close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-body">
          {/* LEFT */}
          <div className="modal-left">
            <div className="field">
              <label>No Nota</label>
              <input value={form.noNota} readOnly />
            </div>

            <div className="field">
              <label>Tanggal</label>
              <input
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Nama Pelanggan / Rekanan</label>
              <input
                name="namaPelanggan"
                value={form.namaPelanggan}
                onChange={handleChange}
              />
            </div>

            <div className="field">
              <label>Metode Bayar</label>
              <select
                name="metodeBayar"
                value={form.metodeBayar}
                onChange={handleChange}
              >
                <option value="Tunai">Tunai</option>
                <option value="Transfer">Transfer</option>
              </select>
            </div>

            <div className="field">
              <label>Status Bayar</label>
              <select
                name="statusBayar"
                value={form.statusBayar}
                onChange={handleChange}
              >
                <option value="Lunas">Lunas</option>
                <option value="Bon">Bon</option>
              </select>
            </div>
          </div>

          {/* RIGHT */}
          <div className="modal-right">
            <div className="add-barang">
              <div className="search-box">
                <input
                  placeholder="Cari barang..."
                  value={searchBarang}
                  onChange={e => {
                    setSearchBarang(e.target.value);
                    setShowDropdown(true);
                  }}
                  onFocus={() => setShowDropdown(true)}
                />

                {showDropdown && filteredBarang.length > 0 && (
                  <div className="dropdown">
                    {filteredBarang.map(b => (
                      <div
                        key={b.id}
                        className="dropdown-item"
                        onClick={() => {
                          setSelectedBarang(b);
                          setSearchBarang(b.namaBarang);
                          setShowDropdown(false);
                        }}
                      >
                        <div className="name">{b.namaBarang}</div>
                        <div className="price">
                          Rp {b.hargaJual.toLocaleString("id-ID")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <button type="button" onClick={addBarang}>
                Tambah
              </button>
            </div>

            <div className="table-wrapper">
              <table className="item-table">
                <thead>
                  <tr>
                    <th>Barang</th>
                    <th className="right">Harga</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan="3" className="empty">
                        Belum ada barang
                      </td>
                    </tr>
                  )}
                  {items.map((it, idx) => (
                    <tr key={idx}>
                      <td>{it.namaBarang}</td>
                      <td className="right">
                        Rp {it.harga.toLocaleString("id-ID")}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="remove"
                          onClick={() => removeBarang(idx)}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="summary">
              <div>Total Item: <strong>{totalItem}</strong></div>
              <div>
                Total Harga:
                <strong> Rp {totalHarga.toLocaleString("id-ID")}</strong>
              </div>
            </div>
        {/* FOOTER */}
        <div className="modal-footer">
          <button type="button" className="btn ghost" onClick={onClose}>
            Batal
          </button>
			<button type="submit" className="btn primary">
			  Simpan Transaksi
			</button>
        </div>
          </div>
        </form>


      </div>
    </div>
  );
}
