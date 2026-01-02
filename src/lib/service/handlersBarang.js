/* ======================================================
   HANDLERSBARANG
   Lokasi: lib/service/handlersBarang.js
====================================================== */

export function useBarangHandlers(state) {
  const handleBarangSearchChange = (e) => {
    state.setBarangSearch(e.target.value);
    state.setSelectedBarang(null);
    state.setShowBarang(true);
  };

  const selectBarang = (item) => {
    state.setSelectedBarang(item);
    state.setBarangSearch(item.nama);
    state.setShowBarang(false);
  };

  const addUsedPart = () => {
    if (!state.selectedBarang) return;

    state.setUsedParts((prev) => [
      ...prev,
      {
        id: state.selectedBarang.id,
        nama: state.selectedBarang.nama,
        qty: 1,
      },
    ]);

    state.setSelectedBarang(null);
    state.setBarangSearch("");
  };

  const updatePartQty = (id, qty) => {
    state.setUsedParts((list) =>
      list.map((p) => (p.id === id ? { ...p, qty: qty || 1 } : p))
    );
  };

  const removePart = (id) => {
    state.setUsedParts((list) => list.filter((p) => p.id !== id));
  };

  return {
    handleBarangSearchChange,
    selectBarang,
    addUsedPart,
    updatePartQty,
    removePart,
  };
}
