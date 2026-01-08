"use client";

import { useState } from "react";
import "@/styles/form/pembayaran-teknisi.css";

export default function FormPembayaranTeknisi({
  teknisi,
  onClose,
  onSubmit
}) {
  const [jumlahBayar, setJumlahBayar] = useState("");
  const [metodeBayar, setMetodeBayar] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalHak = teknisi?.totalHak || 0;
  const sudahDibayar = teknisi?.sudahDibayar || 0;
  const sisaHak = totalHak - sudahDibayar;

  const sisaSetelahBayar =
    sisaHak - (Number(jumlahBayar) || 0);

  const handleSubmit = async e => {
    e.preventDefault();

    if (isSubmitting) return;
    if (!jumlahBayar || Number(jumlahBayar) <= 0) return;
    if (Number(jumlahBayar) > sisaHak) return;
    if (!metodeBayar) return;

    try {
      setIsSubmitting(true);

      await onSubmit({
        idKaryawan: teknisi.id,
        nama: teknisi.nama,
        jumlahBayar: Number(jumlahBayar),
        metodeBayar
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pembayaran-overlay">
      <div className="pembayaran-card">
        <header className="card-header">
          <h4>Pembayaran Teknisi</h4>
          <button
            className="close-btn"
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nama Teknisi</label>
            <input
              type="text"
              value={teknisi.nama}
              disabled
            />
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
              disabled={isSubmitting}
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

          <div className="form-group">
            <label>Metode Bayar</label>
            <select
              value={metodeBayar}
              onChange={e => setMetodeBayar(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">-- Pilih Metode --</option>
              <option value="TUNAI">TUNAI</option>
              <option value="TRANSFER">TRANSFER</option>
            </select>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Batal
            </button>

            <button
              type="submit"
              className="btn primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Menyimpan..." : "Bayar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
