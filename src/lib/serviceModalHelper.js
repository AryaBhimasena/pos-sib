/* ======================================================
   SERVICE MODAL HELPER
   Lokasi: lib/serviceModalHelper.js
====================================================== */

import Swal from "sweetalert2";
import { postAPI } from "@/lib/api";

/* ======================================================
   FORMATTER
====================================================== */
export const formatRupiah = (value) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/* ======================================================
   INIT DATA
====================================================== */
export const initServiceModal = async (signal) => {
  const [
    notaRes,
    merekRes,
    teknisiRes,
    jenisServiceRes,
  ] = await Promise.all([
    postAPI("generate-nota", {}, signal),
    postAPI("get-merek-hp", {}, signal),
    postAPI("get-karyawan", {}, signal),
    postAPI("get-jenis-service", {}, signal),
  ]);

  const merekList = Array.isArray(merekRes.data)
    ? merekRes.data
    : Object.values(merekRes.data || []);

  const teknisiList = Array.isArray(teknisiRes.data)
    ? teknisiRes.data.filter(
        (t) => t.kategoriTenagaKerja === "Teknisi"
      )
    : Object.values(teknisiRes.data || []).filter(
        (t) => t.kategoriTenagaKerja === "Teknisi"
      );

  const jenisServiceList = Array.isArray(jenisServiceRes.data)
    ? jenisServiceRes.data
    : Object.values(jenisServiceRes.data || []);

  const defaultJenisService = jenisServiceList[0] || null;
  const defaultTeknisi = teknisiList[0] || null;

  return {
    nota: notaRes.data.nota,
    today: notaRes.data.today,

    merekList,
    teknisiList,
    jenisServiceList,

    defaultTeknisi: defaultTeknisi?.nama || "",
    defaultTeknisiId: defaultTeknisi?.id || "",

    defaultJenisServiceNama: defaultJenisService?.nama || "",
	defaultJenisServiceId: defaultJenisService?.id || "",
    defaultPersenBagiHasil:
      Number(defaultJenisService?.persenBagiHasil) || 0,
  };
};

/* ======================================================
   HYDRATE FORM (EDIT MODE)
   - Endpoint kirim ID + LABEL
   - Frontend hanya hydrate state (tanpa resolve ulang)
====================================================== */
export const hydrateServiceForm = (
  data,
  setForm,
  setUsedParts
) => {
  if (!data) return;

  const { form, usedParts } = data;

  const normalizeDate = (v) =>
    v ? String(v).split("T")[0] : "";

  setForm((p) => ({
    ...p,

    __recalcKomisi: false, // reset flag kalkulasi

    /* ================= NOTA ================= */
    nota: form.nota || "",

    /* ================= JENIS SERVICE ================= */
    jenisService: form.jenisService || "",
    idJenisService: form.idJenisService || "",

    /* ================= TANGGAL ================= */
    tanggalTerima: normalizeDate(form.tanggalTerima),
    estimasiSelesai: normalizeDate(form.estimasiSelesai),
    estimasiBiaya: String(form.estimasiBiaya || ""),

    /* ================= PELANGGAN ================= */
    pelanggan: form.pelanggan || "",
    hp: form.hp || "",

    /* ================= PERANGKAT ================= */
    merek: form.merek || "",
    idMerekHP: form.idMerekHP || "",
    tipe: form.tipe || "",
    keluhan: form.keluhan || "",

    /* ================= BIAYA ================= */
    jasaToko: String(form.jasaToko || 0),
    komisiTeknisi: Number(form.komisiTeknisiDB || 0),
    persenBagiHasil: Number(form.persenBagiHasil || 0),

    totalBarang: Number(form.totalBarang || 0),
    grandTotal: Number(form.grandTotal || 0),

    /* ================= PEMBAYARAN ================= */
    metodePembayaran: form.metodePembayaran || "",
    statusBayar: form.statusBayar || "BELUM",
    tanggalBayar: normalizeDate(form.tanggalBayar),

    /* ================= TEKNISI ================= */
    teknisi: form.teknisi || "",
    idKaryawan: form.idKaryawan || "",

    /* ================= STATUS ================= */
    statusService: form.statusService || "DITERIMA",
  }));

  /* ================= USED PARTS ================= */
  setUsedParts(
    Array.isArray(usedParts)
      ? usedParts.map((p) => ({
          uuid: p.uuid,
          id: p.id || p.idBarang || "",
          nama: p.nama || "",
          hargaJual: Number(p.hargaJual || 0),
          status: p.status || "used",
        }))
      : []
  );
};

/* ======================================================
   AUTOCOMPLETE PELANGGAN
====================================================== */
export const fetchPelanggan = async (query, by) => {
  const res = await postAPI("autocomplete-pelanggan", { query, by });
  return res.data || [];
};

/* ======================================================
   SUBMIT SERVICE
====================================================== */
export const submitService = async (
  form,
  usedParts = [],
  mode = "create"
) => {
  const path =
    mode === "edit"
      ? "update-service"
      : "create-service";

  return postAPI(path, {
    path, // 🔴 WAJIB untuk GAS

    nota: form.nota,

    tanggalTerima: form.tanggalTerima,
    estimasiSelesai: form.estimasiSelesai,

    pelanggan: form.pelanggan,
    hp: form.hp,

    idMerekHP: form.idMerekHP,
    tipe: form.tipe,
    keluhan: form.keluhan,

    idJenisService: form.idJenisService,
    statusService: form.statusService || "DITERIMA",

    estimasiBiaya: Number(
      String(form.estimasiBiaya || "0").replace(/\D/g, "")
    ),
    jasaToko: Number(
      String(form.jasaToko || "0").replace(/\D/g, "")
    ),
    persenBagiHasil: Number(form.persenBagiHasil || 0),
	komisiTeknisi: form.komisiTeknisi,

    totalBarang: Number(form.totalBarang || 0),
    grandTotal: Number(form.grandTotal || 0),

    idKaryawan: form.idKaryawan,

    metodePembayaran: form.metodePembayaran || "TUNAI",
    statusBayar: form.statusBayar || "BELUM",
    tanggalBayar: form.tanggalBayar || "",

    usedParts,
  });
};

/* ======================================================
   CONFIRM NEW CUSTOMER
====================================================== */
export const confirmNewCustomer = async () => {
  return Swal.fire({
    title: "Data tidak ditemukan",
    text: "Tambahkan pelanggan baru?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Tidak",
  });
};
