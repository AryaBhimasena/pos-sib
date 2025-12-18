"use client";

import { useEffect, useRef, useState } from "react";
import { postAPI } from "@/lib/api";
import Swal from "sweetalert2";

/* helper format rupiah */
const formatRupiah = (value) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ServiceModal({ open, onClose }) {
  const abortRef = useRef(null);

  const [form, setForm] = useState({
    nota: "",
    tanggalTerima: "",
    estimasiSelesai: "",
    estimasiBiaya: "",
    pelanggan: "",
    hp: "",
    merek: "",
    tipe: "",
    keluhan: "",
    teknisi: "Agus",
  });

  /* ================= COMBOBOX STATE ================= */
  const [namaList, setNamaList] = useState([]);
  const [hpList, setHpList] = useState([]);
  const [showNama, setShowNama] = useState(false);
  const [showHp, setShowHp] = useState(false);
  const [activeNama, setActiveNama] = useState(-1);
  const [activeHp, setActiveHp] = useState(-1);

  /* ================= PELANGGAN BARU ================= */
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  /* ================= INIT: GENERATE NOTA ================= */
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    abortRef.current = controller;

    const init = async () => {
      try {
        const res = await postAPI("generate-nota", {}, controller.signal);
        setForm((prev) => ({
          ...prev,
          nota: res.data.nota,
          tanggalTerima: res.data.today,
        }));
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Gagal generate nota", err);
        }
      }
    };

    init();
    return () => controller.abort();
  }, [open]);

  /* ================= FETCH AUTOCOMPLETE ================= */
  const fetchPelanggan = async (query, by) => {
    const res = await postAPI("autocomplete-pelanggan", { query, by });
    return res.data || [];
  };

  /* ================= HANDLER UMUM ================= */
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBiayaChange = (e) => {
    setForm({ ...form, estimasiBiaya: formatRupiah(e.target.value) });
  };

  /* ================= NAMA PELANGGAN ================= */
  const handlePelangganChange = async (e) => {
    const value = e.target.value;
    setForm((p) => ({ ...p, pelanggan: value }));
    setShowNama(!!value);
    setActiveNama(-1);

    if (isNewCustomer || !value) {
      setNamaList([]);
      return;
    }

    const data = await fetchPelanggan(value, "nama");
    setNamaList(data);
  };

  const selectNama = (item) => {
    setForm((p) => ({
      ...p,
      pelanggan: item.nama,
      hp: item.hp,
    }));
    setShowNama(false);
  };

  const handleNamaKeyDown = async (e) => {
    if (!showNama) return;

    if (e.key === "ArrowDown") {
      setActiveNama((i) => Math.min(i + 1, namaList.length - 1));
    }

    if (e.key === "ArrowUp") {
      setActiveNama((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeNama >= 0 && namaList[activeNama]) {
        selectNama(namaList[activeNama]);
        return;
      }

      if (!isNewCustomer && form.pelanggan && namaList.length === 0) {
        const confirm = await Swal.fire({
          title: "Data tidak ditemukan",
          text: "Tambahkan pelanggan baru?",
          icon: "question",
          showCancelButton: true,
          confirmButtonText: "Ya",
          cancelButtonText: "Tidak",
        });

        if (confirm.isConfirmed) {
          setIsNewCustomer(true);
          setShowNama(false);
        }
      }
    }
  };

  /* ================= NO HP ================= */
  const handleHpChange = async (e) => {
    const value = e.target.value;
    setForm((p) => ({ ...p, hp: value }));
    setShowHp(true);
    setActiveHp(-1);

    if (isNewCustomer || !value) {
      setHpList([]);
      return;
    }

    const data = await fetchPelanggan(value, "hp");
    setHpList(data);
  };

  const selectHp = (item) => {
    setForm((p) => ({
      ...p,
      pelanggan: item.nama,
      hp: item.hp,
    }));
    setShowHp(false);
  };

  const handleHpKeyDown = (e) => {
    if (!showHp) return;

    if (e.key === "ArrowDown") {
      setActiveHp((i) => Math.min(i + 1, hpList.length - 1));
    }
    if (e.key === "ArrowUp") {
      setActiveHp((i) => Math.max(i - 1, 0));
    }
    if (e.key === "Enter" && activeHp >= 0) {
      selectHp(hpList[activeHp]);
    }
  };

  /* ================= SIMPAN ================= */
  const handleSubmit = async () => {
    try {
      await postAPI("create-service", {
        nota: form.nota,
        tanggalTerima: form.tanggalTerima,
        estimasiSelesai: form.estimasiSelesai,
        estimasiBiaya: Number(form.estimasiBiaya.replace(/\./g, "")),
        pelanggan: form.pelanggan,
        hp: form.hp,
        merek: form.merek,
        tipe: form.tipe,
        keluhan: form.keluhan,
        teknisi: form.teknisi,
      });

      onClose();
    } catch (err) {
      console.error("Gagal simpan service", err);
      alert("Gagal menyimpan data service");
    }
  };

  /* ================= RENDER GUARD ================= */
  if (!open) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-container large">

        {/* ================= HEADER ================= */}
        <div className="modal-header">
          <h3>Service Baru</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ================= CONTENT ================= */}
        <div className="modal-content two-column">

          {/* ================= FORM ================= */}
          <div className="service-form">
            <div className="form-grid-3">
              <div className="form-group">
                <label>No Nota</label>
                <input value={form.nota} disabled />
              </div>

              <div className="form-group">
                <label>Tanggal Terima</label>
                <input type="date" name="tanggalTerima" value={form.tanggalTerima} onChange={handleChange} />
              </div>

              <div className="form-group">
                <label>Estimasi Selesai</label>
                <input type="date" name="estimasiSelesai" value={form.estimasiSelesai} onChange={handleChange} />
              </div>
            </div>

            <div className="form-grid-biaya">
              <div className="form-group biaya-label">
                <label>Estimasi Biaya Awal</label>
              </div>
              <div className="form-group biaya-input">
                <input name="estimasiBiaya" value={form.estimasiBiaya} onChange={handleBiayaChange} />
                <small>Masukkan estimasi biaya awal (manual)</small>
              </div>
            </div>

            <div className="form-section">
              <div className="form-section-header">
                <h4>Informasi Pelanggan</h4>

                <label className="pelanggan-baru">
                  <input type="checkbox" checked={isNewCustomer} onChange={(e) => setIsNewCustomer(e.target.checked)} />
                  <span>Pelanggan Baru</span>
                </label>
              </div>

              <div className="form-grid-2">
                <div className="form-group combobox">
                  <label>Nama Pelanggan</label>
                  <input
                    name="pelanggan"
                    value={form.pelanggan}
                    onChange={handlePelangganChange}
                    onKeyDown={handleNamaKeyDown}
                    onFocus={() => setShowNama(true)}
                  />
                  {showNama && namaList.length > 0 && (
                    <ul className="combo-list">
                      {namaList.map((item, i) => (
                        <li key={i} className={i === activeNama ? "active" : ""} onMouseDown={() => selectNama(item)}>
                          {item.nama}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-group combobox">
                  <label>No HP</label>
                  <input
                    name="hp"
                    value={form.hp}
                    onChange={handleHpChange}
                    onKeyDown={handleHpKeyDown}
                    onFocus={() => setShowHp(true)}
                  />
                  {showHp && hpList.length > 0 && (
                    <ul className="combo-list">
                      {hpList.map((item, i) => (
                        <li key={i} className={i === activeHp ? "active" : ""} onMouseDown={() => selectHp(item)}>
                          {item.hp}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-group">
                  <label>Merek HP</label>
                  <select name="merek" value={form.merek} onChange={handleChange}>
                    <option value="">Pilih Merek</option>
                    <option>Samsung</option>
                    <option>Apple</option>
                    <option>Xiaomi</option>
                    <option>Oppo</option>
                    <option>Vivo</option>
                    <option>Realme</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipe HP</label>
                  <select name="tipe" value={form.tipe} onChange={handleChange}>
                    <option value="">Pilih Tipe</option>
                    <option>Entry Level</option>
                    <option>Mid Range</option>
                    <option>Flagship</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Keluhan / Kerusakan</label>
                <textarea name="keluhan" value={form.keluhan} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* ================= LIVE PREVIEW NOTA ================= */}
          <div className="service-preview landscape">
            <div className="nota-landscape">
              <div className="nota-kop">
                <div className="nota-logo">LOGO</div>
                <div className="nota-identitas">
                  <strong>SIB SERVICE CENTER</strong>
                  <span>Jl. Contoh No. 12</span>
                  <span>Telp / WA: 0812-xxxx-xxxx</span>
                </div>
                <div className="nota-no">
                  <span>NOTA SERVICE</span>
                  <strong>{form.nota}</strong>
                </div>
              </div>

              <div className="nota-divider" />

              <div className="nota-grid">
                <div><label>Tanggal Terima</label><span>{form.tanggalTerima}</span></div>
                <div><label>Estimasi Selesai</label><span>{form.estimasiSelesai}</span></div>
                <div><label>Teknisi</label><span>{form.teknisi}</span></div>
                <div><label>Pelanggan</label><span>{form.pelanggan}</span></div>
                <div><label>No HP</label><span>{form.hp}</span></div>
                <div><label>Perangkat</label><span>{form.merek} {form.tipe}</span></div>
              </div>

              <div className="nota-keluhan">
                <label>Keluhan / Kerusakan</label>
                <p>{form.keluhan}</p>
              </div>

              <div className="nota-footer">
                <div>
                  <label>Estimasi Biaya</label>
                  <strong>Rp {form.estimasiBiaya}</strong>
                </div>
                <div className="nota-ttd">
                  <span>Penerima</span>
                  <div className="ttd-box" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="modal-footer">
          <div className="footer-actions full">
            <div className="footer-group">
              <label>Pilih Teknisi</label>
              <select name="teknisi" value={form.teknisi} onChange={handleChange}>
                <option>Agus</option>
                <option>Doni</option>
                <option>Rizal</option>
              </select>
            </div>

            <button className="btn wa">Kirim WA</button>
            <button className="btn print">Print</button>
            <button className="btn secondary" onClick={onClose}>Batal</button>
            <button className="btn primary" onClick={handleSubmit}>Simpan</button>
          </div>
        </div>

      </div>
    </div>
  );
}
