"use client";

import "@/styles/pettyCashModal.css";
import { formatTanggal } from "@/lib/dashboardHelper";

export default function PettyCashModal({
  open,
  onClose,
  onSubmit,
  value,
  onChange,
}) {
  if (!open) return null;

  return (
    <div className="petty-modal-backdrop">
      <div className="petty-modal-container">
        <h3>Input Petty Cash</h3>
        <p className="petty-modal-date">
          Tanggal: {formatTanggal(new Date())}
        </p>

        <input
          type="number"
          placeholder="Nominal petty cash"
          value={value}
          onChange={e => onChange(e.target.value)}
          className="petty-modal-input"
        />

        <div className="petty-modal-actions">
          <button className="action" onClick={onClose}>
            Batal
          </button>
          <button className="action primary" onClick={onSubmit}>
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
