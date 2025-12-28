"use client";

export default function ServicePaymentMethod({
  form,
  handleChange,
}) {
  return (
    <div className="form-section">
      <h4>Metode Pembayaran</h4>

      <div className="radio-group">
        <label>
          <input
            type="radio"
            name="metodePembayaran"
            value="TUNAI"
            checked={form.metodePembayaran === "TUNAI"}
            onChange={handleChange}
          />
          Tunai
        </label>

        <label>
          <input
            type="radio"
            name="metodePembayaran"
            value="TRANSFER"
            checked={form.metodePembayaran === "TRANSFER"}
            onChange={handleChange}
          />
          Transfer
        </label>
      </div>
    </div>
  );
}
