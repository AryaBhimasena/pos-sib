"use client";

import "@/styles/components.css";

export default function ServicePaymentMethod({
  form,
  handleChange,
}) {
  return (
    <div className="metodebayar-section">
      <h4 className="metodebayar-title">Metode Pembayaran</h4>

      <div className="metodebayar-row">
        {/* METODE PEMBAYARAN */}
        <div className="metodebayar-radio-group">
          <label className="metodebayar-radio-label">
            <input
              type="radio"
              name="metodePembayaran"
              value="TUNAI"
              checked={form.metodePembayaran === "TUNAI"}
              onChange={handleChange}
              className="metodebayar-radio-input"
            />
            Tunai
          </label>

          <label className="metodebayar-radio-label">
            <input
              type="radio"
              name="metodePembayaran"
              value="TRANSFER"
              checked={form.metodePembayaran === "TRANSFER"}
              onChange={handleChange}
              className="metodebayar-radio-input"
            />
            Transfer
          </label>
        </div>

        {/* STATUS BAYAR */}
        <div className="metodebayar-select-wrapper">
          <select
            name="statusBayar"
            value={form.statusBayar}
            onChange={handleChange}
            className="metodebayar-select"
          >
            <option value="BELUM">Belum Bayar</option>
            <option value="LUNAS">Lunas</option>
          </select>
        </div>
      </div>
    </div>
  );
}
