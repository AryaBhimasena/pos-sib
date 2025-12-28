"use client";

import { useEffect } from "react";
import { useServiceUsedParts } from "./useServiceUsedParts";

/**
 * ServiceUsedParts
 * - PURE UI
 * - SEMUA logic dari hook
 */
export default function ServiceUsedParts({ open, onChange }) {
  const {
    usedParts = [],
    barangSearch = "",
    filteredBarang = [],
    selectedBarang,
    showBarang,

    setBarangSearch,
    setSelectedBarang,
    setShowBarang,

    addPart,
    updateQty,
    removePart,
  } = useServiceUsedParts(open);

useEffect(() => {
    if (onChange) onChange(usedParts);
  }, [usedParts]);
  
  return (
    <div className="form-section">
      <div className="form-section-header">
        <h4>Part Digunakan</h4>
        <span className="muted">
          Dicatat sebelum nota disimpan (stok belum berkurang)
        </span>
      </div>

      {/* INPUT */}
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
              {filteredBarang.map((item) => (
                <li
                  key={item.id}
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
            onClick={addPart}
          >
            + Tambah
          </button>
        </div>
      </div>

      {/* TABLE */}
      {usedParts.length > 0 ? (
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
                      updateQty(p.id, e.target.value)
                    }
                  />
                </td>
                <td className="text-center">
                  <button
                    className="icon-btn danger"
                    onClick={() => removePart(p.id)}
                  >
                    🗑
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="muted small">
          Belum ada part yang digunakan
        </p>
      )}
    </div>
  );
}
