"use client";

import { useServiceModal } from "@/lib/useServiceModal";
import { useEffect, useState } from "react";
import { postAPI } from "@/lib/api";

export default function ServiceModal({ open, onClose }) {
  const {
    form,
    setForm,

    merekList,
    teknisiList,

    namaList,
    hpList,
    showNama,
    showHp,
    activeNama,
    activeHp,

    isNewCustomer,
    setIsNewCustomer,

    handleChange,
    handleBiayaChange,
    handlePelangganChange,
    handleNamaKeyDown,
    handleHpChange,
    handleSubmit,

    setShowNama,
    setShowHp,
    setActiveNama,
    setActiveHp,
  } = useServiceModal(open, onClose);

  /* ================= PART DIGUNAKAN (UI ONLY) ================= */
  const [partQuery, setPartQuery] = useState("");
  const [usedParts, setUsedParts] = useState([]);

  /* ================= MASTER BARANG ================= */
  const [barangList, setBarangList] = useState([]);
  const [barangSearch, setBarangSearch] = useState("");
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showBarang, setShowBarang] = useState(false);

  /* ================= LOAD MASTER BARANG ================= */
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        const res = await postAPI("barang");
        if (res.status === "OK") {
          setBarangList(res.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat data barang", err);
      }
    })();
  }, [open]);

  useEffect(() => {
    if (!barangSearch) {
      setFilteredBarang([]);
      return;
    }

    const keyword = barangSearch.toLowerCase();

    const result = barangList.filter((item) =>
      item.nama?.toLowerCase().includes(keyword) ||
      item.sku?.toLowerCase().includes(keyword) ||
      item.id?.toLowerCase().includes(keyword)
    );

    setFilteredBarang(result.slice(0, 8));
  }, [barangSearch, barangList]);

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
          <div className="service-form">

            {/* ================= FORM DATA ================= */}
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

            {/* ================= BIAYA ================= */}
            <div className="form-grid-biaya">
              <div className="form-group biaya-label">
                <label>Estimasi Biaya Awal</label>
              </div>
              <div className="form-group biaya-input">
                <input
                  name="estimasiBiaya"
                  value={form.estimasiBiaya}
                  onChange={handleBiayaChange}
                />
                <small>Masukkan estimasi biaya awal (manual)</small>
              </div>
            </div>

            {/* ================= PELANGGAN ================= */}
            <div className="form-section">
              <div className="form-section-header">
                <h4>Informasi Pelanggan</h4>
                <label className="pelanggan-baru">
                  <input
                    type="checkbox"
                    checked={isNewCustomer}
                    onChange={(e) => setIsNewCustomer(e.target.checked)}
                  />
                  <span>Pelanggan Baru</span>
                </label>
              </div>

              <div className="form-grid-2">

                {/* ===== NAMA ===== */}
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
                        <li
                          key={item.hp || i}
                          className={i === activeNama ? "active" : ""}
                          onMouseDown={() => {
                            setForm((p) => ({
                              ...p,
                              pelanggan: item.nama,
                              hp: item.hp,
                            }));
                            setShowNama(false);
                          }}
                        >
                          {item.nama}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ===== HP ===== */}
                <div className="form-group combobox">
                  <label>No HP</label>
                  <input
                    name="hp"
                    value={form.hp}
                    onChange={handleHpChange}
                    onKeyDown={(e) => {
                      if (!showHp) return;
                      if (e.key === "ArrowDown")
                        setActiveHp((i) => Math.min(i + 1, hpList.length - 1));
                      if (e.key === "ArrowUp")
                        setActiveHp((i) => Math.max(i - 1, 0));
                      if (e.key === "Enter" && activeHp >= 0) {
                        const item = hpList[activeHp];
                        setForm((p) => ({
                          ...p,
                          pelanggan: item.nama,
                          hp: item.hp,
                        }));
                        setShowHp(false);
                      }
                    }}
                    onFocus={() => setShowHp(true)}
                  />
                  {showHp && hpList.length > 0 && (
                    <ul className="combo-list">
                      {hpList.map((item, i) => (
                        <li
                          key={item.hp || i}
                          className={i === activeHp ? "active" : ""}
                          onMouseDown={() => {
                            setForm((p) => ({
                              ...p,
                              pelanggan: item.nama,
                              hp: item.hp,
                            }));
                            setShowHp(false);
                          }}
                        >
                          {item.hp}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* ===== MEREK ===== */}
                <div className="form-group">
                  <label>Merek HP</label>
                  <select
                    name="merek"
                    value={form.merek}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Merek</option>
                    {merekList.map((m, i) => (
                      <option key={m.id || i} value={m.nama}>
                        {m.nama}
                      </option>
                    ))}
                  </select>
                </div>

                {/* ===== TIPE ===== */}
                <div className="form-group">
                  <label>Tipe HP</label>
                  <select
                    name="tipe"
                    value={form.tipe}
                    onChange={handleChange}
                  >
                    <option value="">Pilih Tipe</option>
                    <option>Entry Level</option>
                    <option>Mid Range</option>
                    <option>Flagship</option>
                  </select>
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

            {/* ================= PART DIGUNAKAN ================= */}
            <div className="form-section">
              <div className="form-section-header">
                <h4>Part Digunakan</h4>
                <span className="muted">
                  Dicatat sebelum nota disimpan (stok belum berkurang)
                </span>
              </div>

              <div className="form-grid-3">
                <div className="form-group combobox span-2">
                  <label>Cari Part</label>
                  <input
                    placeholder="Cari nama part / SKU"
                    value={barangSearch}
                    onChange={(e) => {
                      setBarangSearch(e.target.value);
                      setSelectedBarang(null);
                      setShowBarang(true);
                    }}
                    onFocus={() => setShowBarang(true)}
                  />

                  {showBarang && filteredBarang.length > 0 && (
                    <ul className="combo-list">
                      {filteredBarang.map((item, i) => (
                        <li
                          key={item.id || i}
                          onMouseDown={() => {
                            setSelectedBarang(item);
                            setBarangSearch(item.nama);
                            setShowBarang(false);
                          }}
                        >
                          <strong>{item.nama}</strong>
                          <br />
                          <small>{item.sku}</small>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="form-group">
                  <label>&nbsp;</label>
                  <button
                    type="button"
                    className="btn secondary full"
                    disabled={!selectedBarang}
                    onClick={() => {
                      if (!selectedBarang) return;

                      setUsedParts((prev) => [
                        ...prev,
                        {
                          id: selectedBarang.id,
                          nama: selectedBarang.nama,
                          qty: 1,
                        },
                      ]);

                      setSelectedBarang(null);
                      setBarangSearch("");
                    }}
                  >
                    + Tambah
                  </button>
                </div>
              </div>

              {usedParts.length > 0 && (
                <table className="dashboard-table compact">
                  <thead>
                    <tr>
                      <th>Nama Part</th>
                      <th style={{ width: 100 }}>Qty</th>
                      <th style={{ width: 60 }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usedParts.map((p) => (
                      <tr key={p.id}>
                        <td>{p.nama}</td>
                        <td>
                          <input
                            type="number"
                            min="1"
                            value={p.qty}
                            onChange={(e) =>
                              setUsedParts((list) =>
                                list.map((x) =>
                                  x.id === p.id
                                    ? { ...x, qty: Number(e.target.value) || 1 }
                                    : x
                                )
                              )
                            }
                          />
                        </td>
                        <td className="text-center">
                          <button
                            className="icon-btn danger"
                            title="Hapus"
                            onClick={() =>
                              setUsedParts((list) =>
                                list.filter((x) => x.id !== p.id)
                              )
                            }
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {usedParts.length === 0 && (
                <p className="muted small">Belum ada part yang digunakan</p>
              )}
            </div>

          </div>

          {/* ================= PREVIEW ================= */}
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
                {teknisiList.map((t, i) => (
                  <option key={t.id || i} value={t.nama}>
                    {t.nama}
                  </option>
                ))}
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
