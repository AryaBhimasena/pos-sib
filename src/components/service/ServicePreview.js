/* ======================================================
   SERVICE PREVIEW COMPONENT UI
   Lokasi: src/components/service/ServicePreview.js
====================================================== */
"use client";

import { useServicePreview } from "./useServicePreview";

export default function ServicePreview({ sourceForm, usedParts }) {
  const { preview } = useServicePreview(sourceForm, usedParts);

  const formatNumber = (value) =>
    new Intl.NumberFormat("id-ID").format(Number(value) || 0);

  if (!preview) {
    return (
      <div className="service-preview landscape muted">
        <p>Preview nota akan tampil di sini</p>
      </div>
    );
  }

  return (
    <div className="service-preview landscape">
      <div className="nota-landscape">

        {/* KOP */}
        <div className="nota-kop">
          <div className="nota-logo">LOGO</div>

          <div className="nota-identitas">
            <strong>SIB SERVICE CENTER</strong>
            <span>Jl. Contoh No. 12</span>
            <span>Telp / WA: 0812-xxxx-xxxx</span>
          </div>

          <div className="nota-no">
            <span>NOTA SERVICE</span>
            <strong>{preview.nota}</strong>
          </div>
        </div>

        <div className="nota-divider" />

        {/* DATA */}
        <div className="nota-grid">
          <div>
            <label>Tanggal Terima</label>
            <span>{preview.tanggalTerima}</span>
          </div>
          <div>
            <label>Estimasi Selesai</label>
            <span>{preview.estimasiSelesai}</span>
          </div>
          <div>
            <label>Teknisi</label>
            <span>{preview.teknisi}</span>
          </div>

          {/* JENIS SERVICE */}
          <div>
            <label>Jenis Service</label>
            <span>{preview.jenisService}</span>
          </div>

          <div>
            <label>Pelanggan</label>
            <span>{preview.pelanggan}</span>
          </div>
          <div>
            <label>No HP</label>
            <span>{preview.hp}</span>
          </div>
          <div>
            <label>Perangkat</label>
            <span>{preview.perangkat}</span>
          </div>
        </div>

        {/* KELUHAN */}
        <div className="nota-keluhan">
          <label>Keluhan / Kerusakan</label>
          <p>{preview.keluhan}</p>
        </div>

        {/* FOOTER BIAYA */}
        <div className="nota-footer">
          <div>
            <label>{preview.biayaLabel}</label>
            <strong>Rp {formatNumber(preview.biayaValue)}</strong>
          </div>

          <div className="nota-ttd">
            <span>Penerima</span>
            <div className="ttd-box" />
          </div>
        </div>

      </div>
    </div>
  );
}
