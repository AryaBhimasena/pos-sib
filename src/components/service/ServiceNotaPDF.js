/* ======================================================
   NOTA TO PDF
   Lokasi: src/components/service/ServiceNotaPDF.js
====================================================== */
"use client";

import React, { forwardRef } from "react";
import "@/styles/service-nota-pdf.css";

const ServiceNotaPDF = forwardRef(({ preview }, ref) => {
  if (!preview) return null;

  const formatNumber = (value) =>
    new Intl.NumberFormat("id-ID").format(Number(value) || 0);

  return (
    <div className="nota-page">
      <div ref={ref} className="nota-container">
        {/* ================= HEADER ================= */}
        <div className="nota-header">
          <div className="nota-header-left">
            <div className="nota-logo" />
            <div>
              <div className="nota-title">SIB SERVICE CENTER</div>
              <div className="nota-text">Jl. Contoh No. 12</div>
              <div className="nota-text">Telp / WA: 0812-xxxx-xxxx</div>
            </div>
          </div>

          <div className="nota-header-right">
            <div className="nota-label">NOTA SERVICE</div>
            <div className="nota-number">{preview.nota}</div>
          </div>
        </div>

        <hr className="nota-divider" />

        {/* ================= DATA ================= */}
        <table className="nota-table">
          <tbody>
            <tr>
              <td className="label">Tanggal Terima</td>
              <td>{preview.tanggalTerima}</td>
              <td className="label">Estimasi Selesai</td>
              <td>{preview.estimasiSelesai}</td>
            </tr>
            <tr>
              <td className="label">Teknisi</td>
              <td>{preview.teknisi}</td>
              <td className="label">Jenis Service</td>
              <td>{preview.jenisService}</td>
            </tr>
            <tr>
              <td className="label">Pelanggan</td>
              <td>{preview.pelanggan}</td>
              <td className="label">No HP</td>
              <td>{preview.hp}</td>
            </tr>
            <tr>
              <td className="label">Perangkat</td>
              <td colSpan={3}>{preview.perangkat}</td>
            </tr>
          </tbody>
        </table>

        {/* ================= KELUHAN ================= */}
        <div className="nota-keluhan">
          <div className="keluhan-title">Keluhan / Kerusakan</div>
          <div className="keluhan-box">{preview.keluhan}</div>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="nota-footer">
          <div>
            <div className="biaya-label">Total Biaya</div>
            <div className="biaya-value">
              Rp {formatNumber(preview.biayaValue)}
            </div>
          </div>

          <div className="penerima">
            <div>Penerima</div>
            <div className="signature-line" />
          </div>
        </div>
      </div>
    </div>
  );
});

export default ServiceNotaPDF;
