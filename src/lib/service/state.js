/* ======================================================
   SERVICE STATE
   Lokasi: lib/service/state.js
====================================================== */

import { useState } from "react";

export function useServiceState() {
  const [form, setForm] = useState({
    nota: "",                    // 1. No Nota (ID_Service)
    jenisService: "",             // 2. Jenis Service (Nama / Label UI)
    tanggalTerima: "",            // 3. Tanggal Terima
    estimasiSelesai: "",          // 4. Estimasi Selesai
    estimasiBiaya: "",            // 5. Estimasi Biaya Awal (sebelum real cost)

    pelanggan: "",               // 6. Nama Pelanggan
    hp: "",                      // 7. No HP

    merek: "",                   // 8. Merek HP (LABEL UI)
    idMerekHP: "",               //    ID_MerekHP (PAYLOAD tbl_TransaksiService)

    tipe: "",                    // 9. Tipe HP
    keluhan: "",                 // 10. Keluhan / Kerusakan

    jasaToko: "",                // 13. Jasa Toko
    persenBagiHasil: 0,          // 14. Persen Komisi Teknisi

    totalBarang: 0,              //    Total part digunakan (COUNT)
    grandTotal: 0,               //    Total Biaya REAL (ServiceTotalBiaya)

    totalBiaya: "",              // 15. (legacy UI, tidak dipakai payload)

    metodePembayaran: "",        // 16. Metode Pembayaran
    statusBayar: "BELUM",        //    Status Bayar (BELUM / LUNAS)
    tanggalBayar: "",            //    Tanggal Bayar (saat DIAMBIL)

    teknisi: "",                 // 17. Nama Teknisi (LABEL UI)
    idKaryawan: "",              //    ID_Karyawan (PAYLOAD)

    statusService: "",           // 18. Status Service (DITERIMA / DIAMBIL / DIBATALKAN)
  });

  const [merekList, setMerekList] = useState([]);
  const [teknisiList, setTeknisiList] = useState([]);
  const [jenisServiceList, setJenisServiceList] = useState([]);

  const [namaList, setNamaList] = useState([]);
  const [hpList, setHpList] = useState([]);
  const [showNama, setShowNama] = useState(false);
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

  return {
    form, setForm,

    merekList, setMerekList,
    teknisiList, setTeknisiList,
    jenisServiceList, setJenisServiceList,

    namaList, setNamaList,
    hpList, setHpList,
    showNama, setShowNama,
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
  };
}
