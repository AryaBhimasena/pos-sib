/* ======================================================
   SERVICE MODAL HELPER
   Lokasi: lib/serviceModal.helper.js
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
   - Generate nota
   - Ambil tanggal aktif
   - Ambil master merek, teknisi, jenis service
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

    defaultJenisService: defaultJenisService?.nama || "",
    defaultPersenBagiHasil:
      Number(defaultJenisService?.persenBagiHasil) || 0,
  };
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
export const submitService = async (form, usedParts = []) => {
  return postAPI("create-service", {
    /* ================= HEADER SERVICE ================= */
    nota: form.nota,
    tanggalTerima: form.tanggalTerima,
    estimasiSelesai: form.estimasiSelesai,

    /* ================= PELANGGAN ================= */
    pelanggan: form.pelanggan,
    hp: form.hp,

    /* ================= PERANGKAT ================= */
    idMerekHP: form.idMerekHP,
    tipe: form.tipe,
    keluhan: form.keluhan,

    /* ================= SERVICE ================= */
    jenisService: form.jenisService,
    statusService: form.statusService || "DITERIMA",

    /* ================= BIAYA ================= */
    estimasiBiaya: Number(
      String(form.estimasiBiaya || "0").replace(/\D/g, "")
    ),
    jasaToko: Number(
      String(form.jasaToko || "0").replace(/\D/g, "")
    ),
    persenBagiHasil: Number(form.persenBagiHasil || 0),

    totalBarang: Number(form.totalBarang || 0),
    grandTotal: Number(form.grandTotal || 0),

    /* ================= SDM ================= */
    idKaryawan: form.idKaryawan,

    /* ================= PEMBAYARAN ================= */
    metodePembayaran: form.metodePembayaran || form.metodeBayar || "TUNAI",
    statusBayar: form.statusBayar || "BELUM",
    tanggalBayar: form.tanggalBayar || "",

    /* ================= PART DIGUNAKAN ================= */
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
