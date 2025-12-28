import { fetchPelanggan, confirmNewCustomer } from "@/lib/serviceModalHelper";

export function useCustomerHandlers(state) {
  const handlePelangganChange = async (e) => {
    const value = e.target.value;

    state.setForm((p) => ({ ...p, pelanggan: value }));
    state.setActiveNama(-1);

    if (state.isNewCustomer || !value.trim()) {
      state.setNamaList([]);
      state.setShowNama(false);
      return;
    }

    state.setShowNama(true);
    state.setNamaList(await fetchPelanggan(value, "nama"));
  };

  const handleNamaKeyDown = async (e) => {
    if (!state.showNama) return;

    if (e.key === "ArrowDown")
      state.setActiveNama((i) => Math.min(i + 1, state.namaList.length - 1));
    if (e.key === "ArrowUp")
      state.setActiveNama((i) => Math.max(i - 1, 0));

    if (e.key === "Enter") {
      e.preventDefault();

      if (state.activeNama >= 0) {
        const item = state.namaList[state.activeNama];
        state.setForm((p) => ({ ...p, pelanggan: item.nama, hp: item.hp }));
        state.setShowNama(false);
        return;
      }

      if (!state.isNewCustomer && state.form.pelanggan && state.namaList.length === 0) {
        const confirm = await confirmNewCustomer();
        if (confirm.isConfirmed) {
          state.setIsNewCustomer(true);
          state.setShowNama(false);
        }
      }
    }
  };

  const handleHpChange = async (e) => {
    const value = e.target.value;

    state.setForm((p) => ({ ...p, hp: value }));
    state.setActiveHp(-1);

    if (state.isNewCustomer || !value.trim()) {
      state.setHpList([]);
      state.setShowHp(false);
      return;
    }

    state.setShowHp(true);
    state.setHpList(await fetchPelanggan(value, "hp"));
  };

  const handleHpKeyDown = async (e) => {
    if (!state.showHp) return;

    if (e.key === "ArrowDown")
      state.setActiveHp((i) => Math.min(i + 1, state.hpList.length - 1));
    if (e.key === "ArrowUp")
      state.setActiveHp((i) => Math.max(i - 1, 0));

    if (e.key === "Enter") {
      e.preventDefault();

      if (state.activeHp >= 0) {
        const item = state.hpList[state.activeHp];
        state.setForm((p) => ({ ...p, pelanggan: item.nama, hp: item.hp }));
        state.setShowHp(false);
      }
    }
  };

  return {
    handlePelangganChange,
    handleNamaKeyDown,
    handleHpChange,
    handleHpKeyDown,
  };
}
