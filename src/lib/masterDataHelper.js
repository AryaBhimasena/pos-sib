/* ======================================================
   MASTER DATA HELPER
   Digunakan untuk CRUD:
   - Pelanggan
   - Barang
   - Supplier
====================================================== */

import { postAPI } from "@/lib/api";

/* ======================================================
   PELANGGAN
====================================================== */
export const pelangganAPI = {
  /**
   * Ambil list pelanggan
   */
  list() {
    return postAPI("pelanggan");
  },

  /**
   * Tambah pelanggan
   * payload: { nama, nohp }
   */
  create(payload) {
    return postAPI("pelanggan/create", payload);
  },

  /**
   * Update pelanggan
   * payload: { id, nama, nohp }
   */
  update(payload) {
    return postAPI("pelanggan/update", payload);
  },

  /**
   * Hapus pelanggan
   * payload: { id }
   */
  delete(id) {
    return postAPI("pelanggan/delete", { id });
  },
};

/* ======================================================
   BARANG
====================================================== */
export const barangAPI = {
  /**
   * Ambil list barang (sudah join kategori, merek, supplier)
   */
  list() {
    return postAPI("barang");
  },

  /**
   * Tambah barang
   */
  create(payload) {
    return postAPI("barang/create", payload);
  },

  /**
   * Update barang
   */
  update(payload) {
    return postAPI("barang/update", payload);
  },

  /**
   * Hapus barang
   */
  delete(id) {
    return postAPI("barang/delete", { id });
  },
};

/* ======================================================
   SUPPLIER
====================================================== */
export const supplierAPI = {
  /**
   * Ambil list supplier
   */
  list() {
    return postAPI("supplier");
  },

  /**
   * Tambah supplier
   */
  create(payload) {
    return postAPI("supplier/create", payload);
  },

  /**
   * Update supplier
   */
  update(payload) {
    return postAPI("supplier/update", payload);
  },

  /**
   * Hapus supplier
   */
  delete(id) {
    return postAPI("supplier/delete", { id });
  },
};
