/* ======================================================
   SERVICE STATE
   Lokasi: lib/service/state.js
====================================================== */

import { useState } from "react";

export const initialServiceForm = {
  nota: "",
  jenisService: "",
  idJenisService:"",
  tanggalTerima: "",
  estimasiSelesai: "",
  estimasiBiaya: "",

  pelanggan: "",
  hp: "",

  merek: "",
  idMerekHP: "",
  tipe: "",
  keluhan: "",

  jasaToko: "",
  persenBagiHasil: 0,
  komisiTeknisi: 0,

  totalBarang: 0,
  grandTotal: 0,

  metodePembayaran: "",
  statusBayar: "BELUM",
  tanggalBayar: "",

  teknisi: "",
  idKaryawan: "",
  statusService: "",
};

export function useServiceState() {
  const [form, setForm] = useState(initialServiceForm);
	
  const [merekList, setMerekList] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);
  const [jenisServiceList, setJenisServiceList] = useState([]);

  const [namaList, setNamaList] = useState([]);
  const [hpList, setHpList] = useState([]);
  const [showNama, setShowNama] = useState(false);
  const [pelangganCache, setPelangganCache] = useState([]);

  const [showHp, setShowHp] = useState(false);
  const [activeNama, setActiveNama] = useState(-1);
  const [activeHp, setActiveHp] = useState(-1);

  const [isNewCustomer, setIsNewCustomer] = useState(false);

  const [barangList, setBarangList] = useState([]);
  const [barangSearch, setBarangSearch] = useState("");
  const [filteredBarang, setFilteredBarang] = useState([]);
  const [selectedBarang, setSelectedBarang] = useState(null);
  const [showBarang, setShowBarang] = useState(false);

  // 11. Part Digunakan
  // 12. Biaya Part (diturunkan dari usedParts)
  const [usedParts, setUsedParts] = useState([]);
  const [isHydrated, setIsHydrated] = useState(false);

  return {
    form, setForm,

    merekList, setMerekList,
    teknisiList, setTeknisiList,
    jenisServiceList, setJenisServiceList,

    namaList, setNamaList,
    hpList, setHpList,
    showNama, setShowNama,
	pelangganCache, setPelangganCache,

    showHp, setShowHp,
    activeNama, setActiveNama,
    activeHp, setActiveHp,

    isNewCustomer, setIsNewCustomer,

    barangList, setBarangList,
    barangSearch, setBarangSearch,
    filteredBarang, setFilteredBarang,
    selectedBarang, setSelectedBarang,
    showBarang, setShowBarang,

    usedParts, setUsedParts,
	isHydrated, setIsHydrated,
  };
}
