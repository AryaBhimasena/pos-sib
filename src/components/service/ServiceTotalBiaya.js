"use client";

import { useEffect } from "react";
import "@/styles/components.css";

export default function ServiceBiayaDanPembayaran({
  form,
  setForm,
  usedParts,
  mode,
  isHydrated,
  handleChange,
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

  /* ================= TOTAL BIAYA SERVICE (INPUT) ================= */
  const totalBiayaService = Number(form.grandTotal) || 0;

	/* ================= KOMISI TEKNISI (HIDDEN) ================= */

	const persenBagiHasil = Number(form.persenBagiHasil) || 0;

	// jasa bersih (tidak boleh minus)
	const jasaBersih = Math.max(
	  Number(totalBiayaService || 0) - Number(biayaPart || 0),
	  0
	);

	// komisi hasil kalkulasi
	const calculatedKomisi = Math.floor(
	  jasaBersih * persenBagiHasil
	);

	// nilai final komisi teknisi
	const komisiTeknisi =
	  mode === "edit" && isHydrated && !form.__recalcKomisi
		? Number(form.komisiTeknisi) || 0
		: calculatedKomisi;

  /* ================= SYNC KE FORM ================= */
  useEffect(() => {
    if (mode === "edit" && !isHydrated) return;

    setForm((prev) => {
      const shouldRecalc =
        mode !== "edit" || prev.__recalcKomisi === true;

      return {
        ...prev,
        ...(shouldRecalc ? { komisiTeknisi } : {}),
        totalBarang: biayaPart,
        grandTotal: totalBiayaService,
      };
    });

    console.log("[SERVICE BIAYA]", {
      mode,
      isHydrated,
      biayaPart,
      totalBiayaService,
      komisiTeknisi,
    });
  }, [
    biayaPart,
    totalBiayaService,
    komisiTeknisi,
    mode,
    isHydrated,
  ]);

  return (
    <>
      {/* ================= TOTAL BIAYA SERVICE ================= */}
      <div className="form-section total-biaya">
        <h4>Total Biaya Service</h4>

        <div className="form-grid-2">
          <div className="form-group">
            <label>Biaya Part</label>
            <input value={formatNumber(biayaPart)} disabled />
          </div>

          <div className="form-group">
            <label>Total Biaya Service</label>
            <input
              value={formatNumber(totalBiayaService)}
              placeholder="0"
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  grandTotal: parseNumber(e.target.value),
                  __recalcKomisi: true, // 🔑 izinkan recalculation
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* ================= METODE PEMBAYARAN ================= */}
      <div className="metodebayar-section">
        <h4 className="metodebayar-title">Metode Pembayaran</h4>

        <div className="metodebayar-row">
          <div className="metodebayar-radio-group">
            <label className="metodebayar-radio-label">
              <input
                type="radio"
                name="metodePembayaran"
                value="TUNAI"
                checked={form.metodePembayaran === "TUNAI"}
                onChange={handleChange}
                className="metodebayar-radio-input"
              />
              Tunai
            </label>

            <label className="metodebayar-radio-label">
              <input
                type="radio"
                name="metodePembayaran"
                value="TRANSFER"
                checked={form.metodePembayaran === "TRANSFER"}
                onChange={handleChange}
                className="metodebayar-radio-input"
              />
              Transfer
            </label>
          </div>

          <div className="metodebayar-select-wrapper">
            <select
              name="statusBayar"
              value={form.statusBayar}
              onChange={handleChange}
              className="metodebayar-select"
            >
              <option value="BELUM">Belum Bayar</option>
              <option value="LUNAS">Lunas</option>
            </select>
          </div>
        </div>
      </div>
    </>
  );
}
