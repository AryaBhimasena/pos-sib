import { submitService, formatRupiah } from "@/lib/serviceModalHelper";

export function useServiceSubmit(
  state,
  onClose,
  mode = "create",
  onSuccess
) {
  const handleChange = (e) =>
    state.setForm({
      ...state.form,
      [e.target.name]: e.target.value,
    });

  /* ================= ESTIMASI BIAYA ================= */
  const handleBiayaChange = (e) =>
    state.setForm({
      ...state.form,
      estimasiBiaya: formatRupiah(e.target.value),
    });

  /* ================= JASA TOKO ================= */
  const handleJasaTokoChange = (e) =>
    state.setForm({
      ...state.form,
      jasaToko: formatRupiah(e.target.value),
    });

  /* ================= GRAND TOTAL (REAL BIAYA) ================= */
  const handleGrandTotalChange = (value) =>
    state.setForm({
      ...state.form,
      grandTotal: value,
    });

  /* ================= TOTAL BARANG ================= */
  const syncTotalBarang = () =>
    state.setForm({
      ...state.form,
      totalBarang: state.usedParts.length,
    });

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      syncTotalBarang();

      const submitForm = {
        ...state.form,
        statusBayar: state.form.statusBayar || "BELUM",
        totalBarang: state.usedParts.length,
      };

      console.log("SUBMIT SERVICE PAYLOAD", {
        mode,
        form: submitForm,
        usedParts: state.usedParts,
      });

      await submitService(
        submitForm,
        state.usedParts,
        mode
      );

	  onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error("Gagal simpan service", err);
      alert("Gagal menyimpan data service");
    }
  };

  return {
    handleChange,
    handleBiayaChange,
    handleJasaTokoChange,
    handleGrandTotalChange,
    handleSubmit,
  };
}
