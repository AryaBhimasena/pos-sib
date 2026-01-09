/* ======================================================
   SALES MODAL
   Lokasi: src/components/penjualan/SalesModal.js
====================================================== */
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "@/styles/sales-modal.css";
import {
  initPenjualanModal,
  submitPenjualan,
  loadDetailBarang,
  getBarangTersedia,
} from "@/lib/penjualan/penjualanModalHelper";

export default function SalesModal({ open, onClose, onSuccess, data }) {
  const isEdit = Boolean(data?.noNota);
  const reqIdRef = useRef(0); // ⬅️ cegah race async
  const dropdownRef = useRef(null);

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

    reqIdRef.current += 1;
    const reqId = reqIdRef.current;

    // reset global state
    setItems([]);
    setSearchBarang("");
    setSelectedBarang(null);

    // load master barang (sekali)
    getBarangTersedia().then(res => {
      if (reqId === reqIdRef.current) {
        setBarangList(res);
      }
    });

    if (isEdit) {
      /* ===== MODE EDIT ===== */
      loadDetailBarang(data.noNota).then(res => {
        if (reqId !== reqIdRef.current) return;

        const { header, items } = res;

        setForm({
          noNota: header.ID_Penjualan,
          tanggal: header.Tanggal,
          namaPelanggan: header.NamaPelanggan || "",
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
	  /* ===== MODE CREATE ===== */
} else {
  initPenjualanModal().then(res => {
    if (reqId === reqIdRef.current) {
      setForm({
        noNota: res.noNota,
        tanggal: res.tanggal,
        namaPelanggan: "",
        metodeBayar: "Tunai",
        statusBayar: "Lunas",
      });
    }
  });
}

  }, [open, isEdit, data?.noNota]);

useEffect(() => {
  if (!showDropdown) return;

  const handleClickOutside = e => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target)
    ) {
      setShowDropdown(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [showDropdown]);

  /* ================= COMPUTED ================= */
  const totalItem = items.length;

  const totalHarga = useMemo(
    () => items.reduce((a, b) => a + Number(b.harga || 0), 0),
    [items]
  );

const filteredBarang = useMemo(() => {
  // ID barang yang sudah dipilih
  const usedIds = new Set(items.map(it => it.idBarang));

  const availableBarang = barangList.filter(
    b => !usedIds.has(b.id)
  );

  if (!searchBarang) return availableBarang;

  const q = searchBarang.toLowerCase();

  return availableBarang.filter(
    b =>
      b.namaBarang?.toLowerCase().includes(q) ||
      String(b.sku || "").toLowerCase().includes(q)
  );
}, [barangList, items, searchBarang]);


  /* ================= HANDLER ================= */
  const handleChange = async e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));

if (name === "tanggal" && !isEdit) {
  reqIdRef.current += 1;
  const reqId = reqIdRef.current;

  const { noNota } = await initPenjualanModal(value);

  if (reqId === reqIdRef.current) {
    setForm(f => ({ ...f, noNota }));
  }
}

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

    const baseBody = {
      tanggal: form.tanggal,
      namaPelanggan: form.namaPelanggan || "",
      metodeBayar: form.metodeBayar,
      statusBayar: form.statusBayar,
      totalItem: items.length,
      totalHarga,
      items: items.map(it => ({
        idBarang: it.idBarang,
        namaBarang: it.namaBarang,
        harga: Number(it.harga),
      })),
    };

    const body = isEdit
      ? { ...baseBody, noNota: form.noNota, mode: "EDIT" }
      : { ...baseBody, mode: "CREATE" };

    try {
      await submitPenjualan(body);
      alert("Transaksi penjualan berhasil disimpan");
      onSuccess?.();
      onClose?.();
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
          <h3>{isEdit ? "Edit Penjualan" : "Penjualan Baru"}</h3>
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
              <div className="search-box" ref={dropdownRef}>
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
