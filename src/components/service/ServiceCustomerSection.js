"use client";

export default function ServiceCustomerSection({
  form,
  setForm,

  merekList,

  namaList,
  hpList,
  showNama,
  showHp,
  activeNama,
  activeHp,

  isNewCustomer,
  setIsNewCustomer,

  handleChange,
  handlePelangganChange,
  handleNamaKeyDown,
  handleHpChange,

  setShowNama,
  setShowHp,
}) {
  return (
    <div className="form-section">
      <div className="form-section-header">
        <h4>Informasi Pelanggan</h4>
        <label className="pelanggan-baru">
          <input
            type="checkbox"
            checked={isNewCustomer}
            onChange={(e) => setIsNewCustomer(e.target.checked)}
          />
          <span>Pelanggan Baru</span>
        </label>
      </div>

      <div className="form-grid-2">

        {/* ================= NAMA ================= */}
        <div className="form-group combobox">
          <label>Nama Pelanggan</label>
          <input
            name="pelanggan"
            value={form.pelanggan}
            onChange={handlePelangganChange}
            onKeyDown={handleNamaKeyDown}
            onFocus={() => setShowNama(true)}
          />

          {showNama && namaList.length > 0 && (
            <ul className="combo-list">
              {namaList.map((item, i) => (
                <li
                  key={item.hp || i}
                  className={i === activeNama ? "active" : ""}
                  onMouseDown={() => {
                    setForm((p) => ({
                      ...p,
                      pelanggan: item.nama,
                      hp: item.hp,
                    }));
                    setShowNama(false);
                  }}
                >
                  {item.nama}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= HP ================= */}
        <div className="form-group combobox">
          <label>No HP</label>
          <input
            name="hp"
            value={form.hp}
            onChange={handleHpChange}
            onFocus={() => setShowHp(true)}
          />

          {showHp && hpList.length > 0 && (
            <ul className="combo-list">
              {hpList.map((item, i) => (
                <li
                  key={item.hp || i}
                  className={i === activeHp ? "active" : ""}
                  onMouseDown={() => {
                    setForm((p) => ({
                      ...p,
                      pelanggan: item.nama,
                      hp: item.hp,
                    }));
                    setShowHp(false);
                  }}
                >
                  {item.hp}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* ================= MEREK ================= */}
        <div className="form-group">
          <label>Merek HP</label>
<select
  value={form.idMerekHP}
  onChange={(e) => {
    const selected = merekList.find(
      (m) => String(m.id) === e.target.value
    );

    setForm((p) => ({
      ...p,
      idMerekHP: selected?.id || "",
      merek: selected?.nama || "",
    }));
  }}
>
  <option value="">Pilih Merek</option>
  {merekList.map((m, i) => (
    <option key={m.id || i} value={m.id}>
      {m.nama}
    </option>
  ))}
</select>

        </div>

        {/* ================= TIPE (INPUT TEKS) ================= */}
        <div className="form-group">
          <label>Tipe HP</label>
          <input
            name="tipe"
            value={form.tipe}
            onChange={handleChange}
            placeholder="Contoh: Redmi Note 13 Pro, A15, iPhone 11"
          />
        </div>

      </div>

      {/* ================= KELUHAN ================= */}
      <div className="form-group">
        <label>Keluhan / Kerusakan</label>
        <textarea
          name="keluhan"
          value={form.keluhan}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}
