"use client";

import { useEffect } from "react";

export default function ServiceTotalBiaya({
  form,
  setForm,
  usedParts,
  mode,
  isHydrated,
}) {
  /* ================= HELPERS ================= */
  const formatNumber = (value) =>
    new Intl.NumberFormat("id-ID").format(Number(value) || 0);

  const parseNumber = (value) =>
    Number(String(value).replace(/\D/g, "")) || 0;

  /* ================= BIAYA PART ================= */
  const biayaPart = Array.isArray(usedParts)
    ? usedParts.reduce(
        (sum, item) => sum + (Number(item.subtotal) || 0),
        0
      )
    : 0;

  /* ================= JASA TOKO ================= */
  const jasaToko = Number(form.jasaToko) || 0;

  /* ================= KOMISI ================= */
  const persenBagiHasil = Number(form.persenBagiHasil) || 0;
  const calculatedKomisi = Math.floor(jasaToko * persenBagiHasil);

  const komisiTeknisi =
    mode === "edit" && isHydrated && !form.__recalcKomisi
      ? Number(form.komisiTeknisi) || 0
      : calculatedKomisi;

  /* ================= GRAND TOTAL ================= */
  const grandTotal = biayaPart + jasaToko + komisiTeknisi;

  /* ================= SYNC KE FORM ================= */
useEffect(() => {
  if (mode === "edit" && !isHydrated) return;

  setForm((prev) => {
    const shouldRecalc =
      mode !== "edit" || prev.__recalcKomisi === true;

    return {
      ...prev,
      ...(shouldRecalc
        ? { komisiTeknisi }
        : {}), // 🔒 JANGAN TIMPA KOMISI BACKEND
      totalBarang: biayaPart,
      grandTotal,
    };
  });
  
  console.log("[TOTAL BIAYA]", {
  mode,
  isHydrated,
  jasaToko,
  persenBagiHasil,
  komisiTeknisi,
});

}, [biayaPart, jasaToko, komisiTeknisi, mode, isHydrated]);

  return (
    <div className="form-section total-biaya">
      <h4>Total Biaya Service</h4>

      <div className="form-grid-3">
        <div className="form-group">
          <label>Biaya Part</label>
          <input value={formatNumber(biayaPart)} disabled />
        </div>

        <div className="form-group">
          <label>Jasa Toko</label>
          <input
            value={formatNumber(jasaToko)}
            placeholder="0"
			onChange={(e) =>
			  setForm((p) => ({
				...p,
				jasaToko: parseNumber(e.target.value),
				__recalcKomisi: true, // 🔑 IZINKAN RECALC
			  }))
			}
          />
        </div>

        <div className="form-group">
          <label>Komisi Teknisi</label>
          <input value={formatNumber(komisiTeknisi)} disabled />
        </div>

        <div className="form-group full">
          <label>Total Biaya Service</label>
          <input value={formatNumber(grandTotal)} disabled />
        </div>
      </div>
    </div>
  );
}
