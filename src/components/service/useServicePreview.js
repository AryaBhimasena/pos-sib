"use client";

import { useEffect, useState } from "react";

/**
 * Hook khusus untuk PREVIEW NOTA SERVICE
 * - Mengelola state snapshot
 * - Menentukan Estimasi Biaya / Total Biaya
 * - Aman untuk format rupiah string
 */

export function useServicePreview(sourceForm, usedParts) {
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!sourceForm) return;

    /* ================= NORMALISASI ESTIMASI BIAYA ================= */
    const estimasiBiaya = Number(
      String(sourceForm.estimasiBiaya || "").replace(/\D/g, "")
    ) || 0;

    /* ================= HITUNG BIAYA PART ================= */
    const biayaPart = Array.isArray(usedParts)
      ? usedParts.reduce(
          (sum, item) => sum + (Number(item.subtotal) || 0),
          0
        )
      : 0;

    /* ================= JASA TOKO ================= */
    const jasaToko = Number(sourceForm.jasaToko || 0);

    /* ================= KOMISI TEKNISI ================= */
    const persenBagiHasil = Number(sourceForm.persenBagiHasil || 0);

    const komisiTeknisi =
      (biayaPart + jasaToko) * persenBagiHasil;

    /* ================= TOTAL BIAYA SERVICE ================= */
    const totalBiayaService =
      biayaPart + jasaToko + komisiTeknisi;

    /* ================= TENTUKAN MODE ================= */
    const hasRealCost =
      biayaPart > 0 || jasaToko > 0;

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

      biayaLabel: hasRealCost ? "Total Biaya" : "Estimasi Biaya",
      biayaValue: hasRealCost ? totalBiayaService : estimasiBiaya,
    });
  }, [sourceForm, usedParts]);

  return {
    preview,
  };
}
