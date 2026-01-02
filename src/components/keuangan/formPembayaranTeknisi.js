"use client";

import { useState } from "react";
import "@/styles/form/pembayaran-teknisi.css";

export default function FormPembayaranTeknisi({ teknisi, onClose, onSubmit }) {
  const [jumlahBayar, setJumlahBayar] = useState("");

  const totalHak = teknisi?.totalHak || 0;
  const sudahDibayar = teknisi?.sudahDibayar || 0;
  const sisaHak = totalHak - sudahDibayar;
  const sisaSetelahBayar = sisaHak - (Number(jumlahBayar) || 0);

  const handleSubmit = e => {
    e.preventDefault();

    if (!jumlahBayar || Number(jumlahBayar) <= 0) return;
    if (Number(jumlahBayar) > sisaHak) return;

    onSubmit({
      teknisiId: teknisi.id,
      nama: teknisi.nama,
      jumlahBayar: Number(jumlahBayar),
    });
  };

  return (
    <div className="pembayaran-overlay">
      <div className="pembayaran-card">
        <header className="card-header">
          <h4>Pembayaran Teknisi</h4>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Teknisi</label>
            <input type="text" value={teknisi.nama} disabled />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Hak</label>
              <input
                type="text"
                value={`Rp ${totalHak.toLocaleString("id-ID")}`}
                disabled
              />
            </div>

            <div className="form-group">
              <label>Sudah Dibayar</label>
              <input
                type="text"
                value={`Rp ${sudahDibayar.toLocaleString("id-ID")}`}
                disabled
              />
            </div>
          </div>

          <div className="form-group">
            <label>Sisa Hak</label>
            <input
              type="text"
              value={`Rp ${sisaHak.toLocaleString("id-ID")}`}
              disabled
              className="highlight"
            />
          </div>

          <div className="form-group">
            <label>Jumlah Bayar</label>
            <input
              type="number"
              placeholder="Masukkan nominal pembayaran"
              value={jumlahBayar}
              onChange={e => setJumlahBayar(e.target.value)}
              max={sisaHak}
            />
          </div>

          <div className="form-group">
            <label>Sisa Setelah Dibayar</label>
            <input
              type="text"
              value={`Rp ${Math.max(
                0,
                sisaSetelahBayar
              ).toLocaleString("id-ID")}`}
              disabled
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn primary">
              Bayar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
