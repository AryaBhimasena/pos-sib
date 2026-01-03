"use client";

import "@/styles/pettyCashModal.css";

export default function PettyCashModal({
  open,
  onClose,
  onSubmit,  // function di parent
  value,
  onChange,
}) {
  if (!open) return null;

  // ===============================
  // TANGGAL UNIVERSAL yyyy-MM-dd
  // ===============================
  const today = (() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  })();

  return (
    <div className="petty-modal-backdrop">
      <div className="petty-modal-container">
        <h3>Input Petty Cash</h3>

        <p className="petty-modal-date">
          Tanggal: {today}
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
          <button
            className="action primary"
            onClick={() => onSubmit(today)} // kirim tanggal ke parent
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
}
