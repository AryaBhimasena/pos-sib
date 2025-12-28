"use client";

export default function ServiceNotaSection({
  form,
  handleChange,
  handleBiayaChange,
}) {
  return (
    <>
      {/* DATA NOTA */}
      {/* BARIS 1 */}
      <div className="form-grid-2">
        <div className="form-group">
          <label>No Nota</label>
          <input value={form.nota} disabled />
        </div>

        <div className="form-group">
          <label>Jenis Service</label>
          <select
            name="jenisService"
            value={form.jenisService || "MESIN"}
            onChange={handleChange}
          >
            <option value="MESIN">Mesin</option>
            <option value="INTERFACE">Interface</option>
          </select>
        </div>
      </div>

      {/* BARIS 2 */}
      <div className="form-grid-2">
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

      {/* BARIS 3 — ESTIMASI BIAYA AWAL */}
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
          <small>Masukkan estimasi biaya awal</small>
        </div>
      </div>
    </>
  );
}
