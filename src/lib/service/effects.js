/* ======================================================
   SERVICE MODAL EFFECT
   Lokasi: lib/service/effects.js
====================================================== */

import { useEffect, useRef } from "react";
import { postAPI } from "@/lib/api";
import {
  initServiceModal,
  hydrateServiceForm,
} from "@/lib/serviceModalHelper";

export function useServiceEffects(open, state, serviceData, mode = "create") {
  const abortRef = useRef(null);

  /* ======================================================
     INIT MODAL (CREATE ONLY)
  ====================================================== */
  useEffect(() => {
    if (!open) return;
    if (mode !== "create") return;

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
  }, [open, mode]);

  /* ======================================================
     HYDRATE STATE (EDIT ONLY)
     - LOAD FULL DATA FROM BACKEND
  ====================================================== */
  useEffect(() => {
    if (!open) return;
    if (mode !== "edit") return;
    if (!serviceData) return;

    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const res = await postAPI(
          "get-service-by-nota",
          { nota: serviceData.id || serviceData.nota },
          controller.signal
        );

        if (res.status !== "OK") {
          throw new Error("Gagal memuat data service");
        }

        hydrateServiceForm(
          res.data,
          state.setForm,
          state.setUsedParts
        );

        /* LOAD MASTER DATA (EDIT MODE) */
        const init = await initServiceModal(controller.signal);
        state.setMerekList(init.merekList);
        state.setTeknisiList(init.teknisiList);
        state.setJenisServiceList(init.jenisServiceList);

      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Hydrate service gagal", err);
        }
      }
    })();

    return () => controller.abort();
  }, [open, mode, serviceData]);

  /* ======================================================
     LOAD MASTER BARANG
  ====================================================== */
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

  /* ======================================================
     FILTER BARANG
  ====================================================== */
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
