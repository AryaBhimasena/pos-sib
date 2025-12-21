/* ======================================================
   SERVICE MODAL HELPER
   Lokasi: lib/serviceModal.helper.js
====================================================== */

import Swal from "sweetalert2";
import { postAPI } from "@/lib/api";

/* ================= FORMATTER ================= */
export const formatRupiah = (value) => {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

/* ================= INIT DATA ================= */
export const initServiceModal = async (signal) => {
  const [notaRes, merekRes, teknisiRes] = await Promise.all([
    postAPI("generate-nota", {}, signal),
    postAPI("get-merek-hp", {}, signal),
    postAPI("get-karyawan", {}, signal),
  ]);

  const merekList = Array.isArray(merekRes.data)
    ? merekRes.data
    : Object.values(merekRes.data || []);

  const teknisiList = Array.isArray(teknisiRes.data)
    ? teknisiRes.data.filter((t) => t.kategori === "Tekhnisi")
    : Object.values(teknisiRes.data || []).filter(
        (t) => t.kategori === "Tekhnisi"
      );

  return {
    nota: notaRes.data.nota,
    today: notaRes.data.today,
    merekList,
    teknisiList,
    defaultTeknisi: teknisiList[0]?.nama || "Agus",
  };
};

/* ================= AUTOCOMPLETE ================= */
export const fetchPelanggan = async (query, by) => {
  const res = await postAPI("autocomplete-pelanggan", { query, by });
  return res.data || [];
};

/* ================= SUBMIT ================= */
export const submitService = async (form) => {
  return postAPI("create-service", {
    nota: form.nota,
    tanggalTerima: form.tanggalTerima,
    estimasiSelesai: form.estimasiSelesai,
    estimasiBiaya: Number(form.estimasiBiaya.replace(/\./g, "")),
    pelanggan: form.pelanggan,
    hp: form.hp,
    merek: form.merek,
    tipe: form.tipe,
    keluhan: form.keluhan,
    teknisi: form.teknisi,
  });
};

/* ================= CONFIRM NEW CUSTOMER ================= */
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
