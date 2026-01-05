"use client";

export default function ServicePaymentMethod({
  form,
  handleChange,
}) {
	
const styles = {
  title: {
    marginBottom: "12px",
    fontSize: "15px",
    fontWeight: 600,
    color: "#111827",
  },

  row: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
  },

  radioGroup: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },

  radioLabel: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "14px",
    color: "#374151",
    cursor: "pointer",
  },

  radio: {
    cursor: "pointer",
  },

  selectWrapper: {
    display: "flex",
    flexDirection: "column",
    minWidth: "160px",
  },

  select: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
};

  return (
    <div style={styles.section}>
      <h4 style={styles.title}>Metode Pembayaran</h4>

      <div style={styles.row}>
        {/* METODE PEMBAYARAN */}
        <div style={styles.radioGroup}>
          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="metodePembayaran"
              value="TUNAI"
              checked={form.metodePembayaran === "TUNAI"}
              onChange={handleChange}
              style={styles.radio}
            />
            Tunai
          </label>

          <label style={styles.radioLabel}>
            <input
              type="radio"
              name="metodePembayaran"
              value="TRANSFER"
              checked={form.metodePembayaran === "TRANSFER"}
              onChange={handleChange}
              style={styles.radio}
            />
            Transfer
          </label>
        </div>

        {/* STATUS BAYAR */}
        <div style={styles.selectWrapper}>
          <select
            name="statusBayar"
            value={form.statusBayar}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="BELUM">Belum Bayar</option>
            <option value="LUNAS">Lunas</option>
          </select>
        </div>
      </div>
    </div>
  );
}
