/* ======================================================
   USE SERVICE MODAL HOOK
   Lokasi: lib/useServiceModal.js
====================================================== */

import { useEffect, useRef, useState } from "react";
import { postAPI } from "@/lib/api";
import {
  formatRupiah,
  initServiceModal,
  fetchPelanggan,
  submitService,
  confirmNewCustomer,
} from "@/lib/serviceModalHelper";

/* ======================================================
   CUSTOM HOOK
====================================================== */
export function useServiceModal(open, onClose) {
  const abortRef = useRef(null);

  /* ================= FORM STATE ================= */
  const [form, setForm] = useState({
    nota: "",
    tanggalTerima: "",
    estimasiSelesai: "",
    estimasiBiaya: "",
    pelanggan: "",
    hp: "",
    merek: "",
    tipe: "",
    keluhan: "",
    teknisi: "Agus",
  });

  /* ================= MASTER DATA ================= */
  const [merekList, setMerekList] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);

  /* ================= COMBOBOX PELANGGAN ================= */
  const [namaList, setNamaList] = useState([]);
  const [hpList, setHpList] = useState([]);
  const [showNama, setShowNama] = useState(false);
  const [showHp, setShowHp] = useState(false);
  const [activeNama, setActiveNama] = useState(-1);
  const [activeHp, setActiveHp] = useState(-1);

  /* ================= PELANGGAN BARU ================= */
  const [isNewCustomer, setIsNewCustomer] = useState(false);

  /* ================= MASTER BARANG ================= */
  const [barangList, setBarangList] = useState([]);
  const [barangSearch, setBarangSearch] = useState("");
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showBarang, setShowBarang] = useState(false);

  /* ================= PART DIGUNAKAN ================= */
  const [usedParts, setUsedParts] = useState([]);

  /* ================= INIT MODAL ================= */
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      try {
        const init = await initServiceModal(controller.signal);

        setForm((p) => ({
          ...p,
          nota: init.nota,
          tanggalTerima: init.today,
          teknisi: init.defaultTeknisi,
        }));

        setMerekList(init.merekList);
        setTeknisiList(init.teknisiList);
      } catch (err) {
        if (err.name !== "AbortError") {
          console.error("Init service modal gagal", err);
        }
      }
    })();

    return () => controller.abort();
  }, [open]);

  /* ================= LOAD MASTER BARANG ================= */
  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        const res = await postAPI("barang");
        if (res.status === "OK") {
          setBarangList(res.data || []);
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

    const result = barangList.filter(
      (item) =>
        item.nama?.toLowerCase().includes(keyword) ||
        item.sku?.toLowerCase().includes(keyword) ||
        item.id?.toLowerCase().includes(keyword)
    );

    setFilteredBarang(result.slice(0, 8));
  }, [barangSearch, barangList]);

  /* ================= HANDLER UMUM ================= */
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleBiayaChange = (e) =>
    setForm({ ...form, estimasiBiaya: formatRupiah(e.target.value) });

  /* ================= PELANGGAN ================= */
  const handlePelangganChange = async (e) => {
    const value = e.target.value;
    setForm((p) => ({ ...p, pelanggan: value }));
    setShowNama(!!value);
    setActiveNama(-1);

    if (isNewCustomer || !value) return setNamaList([]);

    setNamaList(await fetchPelanggan(value, "nama"));
  };

  const handleNamaKeyDown = async (e) => {
    if (!showNama) return;

    if (e.key === "ArrowDown")
      setActiveNama((i) => Math.min(i + 1, namaList.length - 1));
    if (e.key === "ArrowUp")
      setActiveNama((i) => Math.max(i - 1, 0));

    if (e.key === "Enter") {
      e.preventDefault();

      if (activeNama >= 0) {
        const item = namaList[activeNama];
        setForm((p) => ({ ...p, pelanggan: item.nama, hp: item.hp }));
        setShowNama(false);
        return;
      }

      if (!isNewCustomer && form.pelanggan && namaList.length === 0) {
        const confirm = await confirmNewCustomer();
        if (confirm.isConfirmed) {
          setIsNewCustomer(true);
          setShowNama(false);
        }
      }
    }
  };

  const handleHpChange = async (e) => {
    const value = e.target.value;
    setForm((p) => ({ ...p, hp: value }));
    setShowHp(true);
    setActiveHp(-1);

    if (isNewCustomer || !value) return setHpList([]);

    setHpList(await fetchPelanggan(value, "hp"));
  };

  /* ================= BARANG ================= */
  const handleBarangSearchChange = (e) => {
    setBarangSearch(e.target.value);
    setSelectedBarang(null);
    setShowBarang(true);
  };

  const selectBarang = (item) => {
    setSelectedBarang(item);
    setBarangSearch(item.nama);
    setShowBarang(false);
  };

  const addUsedPart = () => {
    if (!selectedBarang) return;

    setUsedParts((prev) => [
      ...prev,
      { id: selectedBarang.id, nama: selectedBarang.nama, qty: 1 },
    ]);

    setSelectedBarang(null);
    setBarangSearch("");
  };

  const updatePartQty = (id, qty) => {
    setUsedParts((list) =>
      list.map((p) => (p.id === id ? { ...p, qty: qty || 1 } : p))
    );
  };

  const removePart = (id) => {
    setUsedParts((list) => list.filter((p) => p.id !== id));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async () => {
    try {
      await submitService({ ...form, usedParts });
      onClose();
    } catch (err) {
      console.error("Gagal simpan service", err);
      alert("Gagal menyimpan data service");
    }
  };

  /* ================= EXPORT ================= */
  return {
    form,
    setForm,

    merekList,
    teknisiList,

    namaList,
    hpList,
    showNama,
    showHp,
    activeNama,
    activeHp,

    isNewCustomer,
    setIsNewCustomer,

    barangSearch,
    filteredBarang,
    selectedBarang,
    showBarang,

    usedParts,

    handleChange,
    handleBiayaChange,
    handlePelangganChange,
    handleNamaKeyDown,
    handleHpChange,

    handleBarangSearchChange,
    selectBarang,
    addUsedPart,
    updatePartQty,
    removePart,

    handleSubmit,

    setShowNama,
    setShowHp,
    setActiveNama,
    setActiveHp,
    setShowBarang,
  };
}
