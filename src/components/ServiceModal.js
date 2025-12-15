"use client";

import { useState } from "react";

/* helper format rupiah */
const formatRupiah = (value) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export default function ServiceModal({ open, onClose }) {
  if (!open) return null;

  const [form, setForm] = useState({
    nota: "SV-00127",
    tanggalTerima: "2025-09-10",
    estimasiSelesai: "2025-09-12",
    estimasiBiaya: "350000",
    pelanggan: "Rina Puspita",
    hp: "081234567890",
    merek: "Apple",
    tipe: "iPhone 11",
    keluhan: "Layar pecah dan baterai cepat habis",
    teknisi: "Agus",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBiayaChange = (e) => {
    setForm({ ...form, estimasiBiaya: formatRupiah(e.target.value) });
  };

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

            {/* GRID ATAS */}
            <div className="form-grid-3">
              <div className="form-group">
                <label>No Nota</label>
                <input value={form.nota} disabled />
              </div>

              <div className="form-group">
                <label>Tanggal Terima</label>
                <input
                  type="date"
                  name="tanggalTerima"
                  value={form.tanggalTerima}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Estimasi Selesai</label>
                <input
                  type="date"
                  name="estimasiSelesai"
                  value={form.estimasiSelesai}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* ESTIMASI BIAYA */}
            <div className="form-grid-biaya">
              <div className="form-group biaya-label">
                <label>Estimasi Biaya Awal</label>
              </div>

              <div className="form-group biaya-input">
                <input
                  name="estimasiBiaya"
                  value={form.estimasiBiaya}
                  onChange={handleBiayaChange}
                  placeholder="Contoh: 350.000"
                />
                <small>Masukkan estimasi biaya awal (manual)</small>
              </div>
            </div>

            {/* ================= INFORMASI PELANGGAN ================= */}
            <div className="form-section">
              <h4>Informasi Pelanggan</h4>

              <div className="form-grid-2">
                <div className="form-group">
                  <label>Nama Pelanggan</label>
                  <input
                    name="pelanggan"
                    value={form.pelanggan}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>No HP</label>
                  <input
                    name="hp"
                    value={form.hp}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Merek HP</label>
                  <input
                    name="merek"
                    value={form.merek}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label>Tipe HP</label>
                  <input
                    name="tipe"
                    value={form.tipe}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Keluhan / Kerusakan</label>
                <textarea
                  name="keluhan"
                  value={form.keluhan}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* ================= PREVIEW NOTA ================= */}
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
              <select
                name="teknisi"
                value={form.teknisi}
                onChange={handleChange}
              >
                <option>Agus</option>
                <option>Doni</option>
                <option>Rizal</option>
              </select>
            </div>

            <button className="btn wa">Kirim WA</button>
            <button className="btn print">Print</button>
            <button className="btn secondary" onClick={onClose}>Batal</button>
            <button className="btn primary">Simpan</button>
          </div>
        </div>

      </div>
    </div>
  );
}
