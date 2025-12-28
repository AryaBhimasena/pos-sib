/* ======================================================
   SERVICE MODAL EFFECT
   Lokasi: lib/service/effects.js
====================================================== */

import { useEffect, useRef } from "react";
import { postAPI } from "@/lib/api";
import { initServiceModal } from "@/lib/serviceModalHelper";

export function useServiceEffects(open, state) {
  const abortRef = useRef(null);

  /* INIT MODAL */
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const init = await initServiceModal(controller.signal);

        state.setForm((p) => ({
          ...p,
          nota: init.nota,
          tanggalTerima: init.today,

          teknisi: init.defaultTeknisi,
		  idKaryawan: init.defaultTeknisiId,
          jenisService: init.defaultJenisService,
          persenBagiHasil: init.defaultPersenBagiHasil,

          // default tambahan sesuai state terbaru
          statusService: p.statusService || "DITERIMA",
        }));

        state.setMerekList(init.merekList);
        state.setTeknisiList(init.teknisiList);
        state.setJenisServiceList(init.jenisServiceList);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Init service modal gagal", err);
        }
      }
    })();

    return () => controller.abort();
  }, [open]);

  /* LOAD MASTER BARANG */
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        const res = await postAPI("barang");
        if (res.status === "OK") {
          state.setBarangList(res.data || []);
        }
      } catch (err) {
        console.error("Gagal memuat data barang", err);
      }
    })();
  }, [open]);

  /* FILTER BARANG */
  useEffect(() => {
    if (!state.barangSearch) {
      state.setFilteredBarang([]);
      return;
    }

    const keyword = state.barangSearch.toLowerCase();

    const result = state.barangList.filter(
      (item) =>
        item.nama?.toLowerCase().includes(keyword) ||
        item.sku?.toLowerCase().includes(keyword) ||
        item.id?.toLowerCase().includes(keyword)
    );

    state.setFilteredBarang(result.slice(0, 8));
  }, [state.barangSearch, state.barangList]);
}
