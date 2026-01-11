"use client";

import { useEffect, useState } from "react";

/**
 * Hook PREVIEW NOTA SERVICE
 * - Tidak melakukan kalkulasi biaya
 * - Hanya menampilkan snapshot dari state form
 * - Total biaya = nilai input user (form.grandTotal)
 */

export function useServicePreview(sourceForm) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!sourceForm) return;

    /* ================= NORMALISASI NILAI ================= */
    const estimasiBiaya = Number(
      String(sourceForm.estimasiBiaya || "").replace(/\D/g, "")
    ) || 0;

    const totalBiayaService = Number(sourceForm.grandTotal || 0);

    /* ================= TENTUKAN LABEL ================= */
    const biayaLabel =
      totalBiayaService > 0 ? "Total Biaya" : "Estimasi Biaya";

    const biayaValue =
      totalBiayaService > 0 ? totalBiayaService : estimasiBiaya;

    /* ================= SNAPSHOT PREVIEW ================= */
    setPreview({
      nota: sourceForm.nota,
      tanggalTerima: sourceForm.tanggalTerima,
      estimasiSelesai: sourceForm.estimasiSelesai,
      teknisi: sourceForm.teknisi,

      jenisService: sourceForm.jenisService,

      pelanggan: sourceForm.pelanggan,
      hp: sourceForm.hp,
      perangkat: `${sourceForm.merek || ""} ${sourceForm.tipe || ""}`,
      keluhan: sourceForm.keluhan,

      biayaLabel,
      biayaValue,
    });
  }, [sourceForm]);

  return {
    preview,
  };
}
