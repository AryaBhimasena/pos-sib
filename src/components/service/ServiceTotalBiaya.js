"use client";

export default function ServiceTotalBiaya({ form, setForm, usedParts }) {
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
  const jasaToko = Number(form.jasaToko || 0);

  /* ================= PERSEN BAGI HASIL ================= */
  const persenBagiHasil = Number(form.persenBagiHasil || 0);

  /* ================= KOMISI TEKNISI ================= */
  const komisiTeknisi =
    (biayaPart + jasaToko) * persenBagiHasil;

  /* ================= TOTAL BIAYA ================= */
  const totalBiayaService =
    biayaPart + jasaToko + komisiTeknisi;

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
            value={jasaToko ? formatNumber(jasaToko) : ""}
            placeholder="0"
            onChange={(e) =>
              setForm((p) => ({
                ...p,
                jasaToko: parseNumber(e.target.value),
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
          <input value={formatNumber(totalBiayaService)} disabled />
        </div>
      </div>
    </div>
  );
}
