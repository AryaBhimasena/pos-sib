/* ======================================================
   USE SERVICE USED PARTS HOOK
   Lokasi: components/service/useServiceUsedParts.js
====================================================== */

"use client";

import { useEffect, useState, useRef } from "react";
import { postAPI } from "@/lib/api";

/**
 * useServiceUsedParts
 * - SELURUH LOGIC part digunakan
 * - STATE lama TIDAK diubah
 * - Harga hanya diperkaya saat addPart
 * - Payload DISIAPKAN untuk:
 *   tbl_TransaksiServiceBarang
 *   tbl_Barang (status)
 *   LedgerKeuangan
 * - SUPPORT HYDRATE MODE (EDIT)
 */
export function useServiceUsedParts(
  open,
  onChange,
  initialUsedParts = []
) {
  /* ================= STATE ================= */
  const [usedParts, setUsedParts] = useState([]);

  const [barangList, setBarangList] = useState([]);
  const [barangSearch, setBarangSearch] = useState("");
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showBarang, setShowBarang] = useState(false);

  const hydratedRef = useRef(false);

  /* ================= RESET SAAT MODAL DITUTUP ================= */
  useEffect(() => {
    if (!open) {
      setUsedParts([]);
      setBarangSearch("");
      setFilteredBarang([]);
      setSelectedBarang(null);
      setShowBarang(false);
      hydratedRef.current = false;
    }
  }, [open]);

  /* ================= HYDRATE USED PARTS (EDIT MODE) ================= */
  useEffect(() => {
    if (!open) return;
    if (hydratedRef.current) return;
    if (!Array.isArray(initialUsedParts)) return;
    if (initialUsedParts.length === 0) return;

    setUsedParts(
      initialUsedParts.map((p) => ({
        ...p,
        qty: Number(p.qty || 1),
        hargaJual: Number(p.hargaJual || 0),
        subtotal:
          Number(p.subtotal) ||
          Number(p.hargaJual || 0) * Number(p.qty || 1),
      }))
    );

    hydratedRef.current = true;
  }, [open, initialUsedParts]);

  /* ================= LOAD MASTER BARANG ================= */
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        const res = await postAPI("barang");
        if (res.status === "OK") {
          setBarangList(Array.isArray(res.data) ? res.data : []);
        }
      } catch (err) {
        console.error("Gagal memuat data barang", err);
      }
    })();
  }, [open]);

  /* ================= FILTER BARANG ================= */
	useEffect(() => {
	  if (!barangSearch) {
		setFilteredBarang([]);
		return;
	  }

	  const keyword = barangSearch.toLowerCase();

	  const result = barangList
		.filter((item) => {
		  // ✅ FILTER STATUS
		  if (item.status !== "TERSEDIA") return false;

		  return (
			item.nama?.toLowerCase().includes(keyword) ||
			item.sku?.toLowerCase().includes(keyword) ||
			item.id?.toLowerCase().includes(keyword)
		  );
		});

	  setFilteredBarang(result.slice(0, 8));
	}, [barangSearch, barangList]);

  /* ================= SYNC KE PARENT ================= */
  useEffect(() => {
    if (onChange) onChange(usedParts);
  }, [usedParts, onChange]);

  /* ================= ACTIONS ================= */
  const addPart = () => {
    if (!selectedBarang) return;

    const hargaJual = Number(selectedBarang.hargaJual) || 0;
    const hargaBeli = Number(selectedBarang.hargaBeli) || 0;
    const now = new Date().toISOString();

    setUsedParts((prev) => [
      ...prev,
      {
        /* === IDENTITAS BARANG === */
        id: selectedBarang.id,
        nama: selectedBarang.nama,
        sku: selectedBarang.sku,

        /* === NILAI KEUANGAN === */
        hargaBeli,
        hargaJual,

        /* === KETENTUAN BARANG UNIK === */
        qty: 1,
        subtotal: hargaJual * 1,

        /* === TIMESTAMP === */
        created_at: now,
        updated_at: now,
      },
    ]);

    setSelectedBarang(null);
    setBarangSearch("");
    setShowBarang(false);
  };

  const updateQty = (id, value) => {
    const qty = Math.max(1, Number(value) || 1);

    setUsedParts((list) =>
      list.map((p) =>
        p.id === id
          ? {
              ...p,
              qty,
              subtotal: p.hargaJual * qty,
              updated_at: new Date().toISOString(),
            }
          : p
      )
    );
  };

  const removePart = (id) => {
    setUsedParts((list) => list.filter((p) => p.id !== id));
  };

  return {
    usedParts,
    barangSearch,
    filteredBarang,
    selectedBarang,
    showBarang,

    setBarangSearch,
    setSelectedBarang,
    setShowBarang,

    addPart,
    updateQty,
    removePart,
  };
}
