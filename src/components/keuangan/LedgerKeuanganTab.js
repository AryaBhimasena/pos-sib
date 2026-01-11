"use client";

import { useEffect, useMemo, useState } from "react";
import { postAPI } from "@/lib/api";
import "@/styles/ledger-keuangan-tab.css";
import {
  getDefaultMonth,
  getMonthRange,
  formatTanggalID,
  filterLedgerRows,
  orderLedgerRowsWithSaldo,

  // === TAMBAHAN ===
  normalizeModalBarangRows,
  filterModalBarangByTanggal,
  sumModalBarang,
} from "@/lib/keuangan/ledgerKeuanganHelper";


export default function LedgerKeuanganTab() {
  const [rows, setRows] = useState([]);
  const [bulanAktif, setBulanAktif] = useState(getDefaultMonth());
  const [tanggalAwal, setTanggalAwal] = useState("");
  const [tanggalAkhir, setTanggalAkhir] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [modalBarang, setModalBarang] = useState({
	  modalService: 0,
	  modalPenjualan: 0,
	});

const fetchModalBarang = async () => {
  let payload = {};

  if (tanggalAwal || tanggalAkhir) {
    payload = { tanggalAwal, tanggalAkhir };
  } else {
    const range = getMonthRange(bulanAktif);
    payload = {
      tanggalAwal: range.tanggalAwal,
      tanggalAkhir: range.tanggalAkhir,
    };
  }

  try {
    const res = await postAPI("get-nilai-modal-barang", payload);

    if (res?.status !== "OK" || !res?.data) {
      console.warn("[fetchModalBarang] response tidak valid", res);
      return;
    }

const penjualanRaw = res.data.penjualan;
const serviceRaw = res.data.service;

const penjualan = normalizeModalBarangRows(penjualanRaw);
const service = normalizeModalBarangRows(serviceRaw);

const penjualanFiltered = filterModalBarangByTanggal(
  penjualan,
  { tanggalAwal, tanggalAkhir }
);

const serviceFiltered = filterModalBarangByTanggal(
  service,
  { tanggalAwal, tanggalAkhir }
);

const modalPenjualan = sumModalBarang(penjualanFiltered);
const modalService = sumModalBarang(serviceFiltered);


    setModalBarang({
      modalPenjualan,
      modalService,
    });
	
  } catch (err) {
    console.error("[fetchModalBarang] ERROR:", err);
  }
};

  const fetchLedger = async bulan => {
    setLoading(true);
    try {
      const range = getMonthRange(bulan);
      const res = await postAPI("get-ledger-keuangan", range);
      const data = Array.isArray(res?.data) ? res.data : [];
      setRows(
        data.map(r => ({
          tanggal: r.Tanggal,
          jenis: r.JenisTransaksi,
          ref: r.RefTransaksi || "",
          debit: Number(r.Debit || 0),
          kredit: Number(r.Kredit || 0),
        }))
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger(bulanAktif);
  }, [bulanAktif]);
  
	useEffect(() => {
	  fetchModalBarang();
	}, [bulanAktif, tanggalAwal, tanggalAkhir]);

const filteredRows = useMemo(
  () =>
    filterLedgerRows(rows, {
      jenisFilter,
      tanggalAwal,
      tanggalAkhir,
    }),
  [rows, jenisFilter, tanggalAwal, tanggalAkhir]
);

const orderedRows = useMemo(
  () => orderLedgerRowsWithSaldo(filteredRows),
  [filteredRows]
);

const laporan = useMemo(() => {
  let pemasukanService = 0;
  let pemasukanPenjualan = 0;
  let komisiTeknisi = 0;

  for (const r of filteredRows) {
    if (r.jenis === "Service") {
      pemasukanService += r.debit;
    }

    if (r.jenis === "Penjualan") {
      pemasukanPenjualan += r.debit;
    }

    if (r.jenis === "Bayar Teknisi") {
      komisiTeknisi += r.kredit;
    }
  }

  const totalPemasukan = pemasukanService + pemasukanPenjualan;

  const modalService = modalBarang.modalService;
  const modalPenjualan = modalBarang.modalPenjualan;

  const totalPengeluaran =
    modalService + modalPenjualan + komisiTeknisi;

  const labaBersih = totalPemasukan - totalPengeluaran;

  return {
    pemasukanService,
    pemasukanPenjualan,
    totalPemasukan,

    modalService,
    modalPenjualan,
    komisiTeknisi,
    totalPengeluaran,

    labaBersih,
  };
}, [filteredRows, modalBarang]);

  const jenisList = [...new Set(rows.map(r => r.jenis))];

  return (
    <div className="ledger-layout">
      {/* LEFT */}
<aside className="ledger-panel">
  <h3 className="panel-title">Perhitungan Laba / Rugi</h3>

  <div className="filter-block">
    <div className="date-row">
      <input
        type="date"
        value={tanggalAwal}
        onChange={e => setTanggalAwal(e.target.value)}
      />
      <span>–</span>
      <input
        type="date"
        value={tanggalAkhir}
        onChange={e => setTanggalAkhir(e.target.value)}
      />
    </div>

    <input
      type="month"
      value={bulanAktif}
      onChange={e => {
        setTanggalAwal("");
        setTanggalAkhir("");
        setBulanAktif(e.target.value);
      }}
    />
  </div>

  <table className="summary">
  <tbody>
	{/* PEMASUKAN */}
	<tr className="section income">
	  <td colSpan={2}>Pemasukan</td>
	</tr>
	<tr className="item income">
	  <td>Service</td>
	  <td className="num">{laporan.pemasukanService.toLocaleString("id-ID")}</td>
	</tr>
	<tr className="item income">
	  <td>Penjualan</td>
	  <td className="num">{laporan.pemasukanPenjualan.toLocaleString("id-ID")}</td>
	</tr>
	<tr className="subtotal">
	  <td>Total Pemasukan</td>
	  <td className="num">{laporan.totalPemasukan.toLocaleString("id-ID")}</td>
	</tr>

	{/* PENGELUARAN */}
	<tr className="section expense">
	  <td colSpan={2}>Pengeluaran</td>
	</tr>
	<tr className="item expense">
	  <td>Harga Modal Service</td>
	  <td className="num">{laporan.modalService.toLocaleString("id-ID")}</td>
	</tr>
	<tr className="item expense">
	  <td>Harga Modal Penjualan</td>
	  <td className="num">{laporan.modalPenjualan.toLocaleString("id-ID")}</td>
	</tr>
	<tr className="item expense">
	  <td>Komisi Teknisi</td>
	  <td className="num">{laporan.komisiTeknisi.toLocaleString("id-ID")}</td>
	</tr>
	<tr className="subtotal">
	  <td>Total Pengeluaran</td>
	  <td className="num">{laporan.totalPengeluaran.toLocaleString("id-ID")}</td>
	</tr>

    {/* LABA / RUGI */}
    <tr className="grand-total">
      <td>Laba Bersih / (Rugi)</td>
      <td className="num">
        {laporan.labaBersih.toLocaleString("id-ID")}
      </td>
    </tr>
  </tbody>
</table>

</aside>

      {/* RIGHT */}
      <section className="ledger-table-wrap">
        <div className="table-header">
          <h3>Detail Transaksi</h3>
          <select
            value={jenisFilter}
            onChange={e => setJenisFilter(e.target.value)}
          >
            <option value="">Semua Jenis Transaksi</option>
            {jenisList.map(j => (
              <option key={j}>{j}</option>
            ))}
          </select>
        </div>

        <div className="table-body">
          <table className="ledger-table">
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>Transaksi</th>
                <th>Referensi</th>
                <th className="num">Debit</th>
                <th className="num">Kredit</th>
                <th className="num">Saldo</th>
              </tr>
            </thead>
			<tbody>
			  {loading && (
				<tr>
				  <td colSpan={6} className="center">
					Memuat data…
				  </td>
				</tr>
			  )}

			  {!loading &&
				orderedRows.map((r, i) => (
				  <tr key={i}>
					<td>{formatTanggalID(r.tanggal)}</td>
					<td>{r.jenis}</td>
					<td>{r.ref}</td>
					<td className="num">
					  {r.debit ? r.debit.toLocaleString("id-ID") : ""}
					</td>
					<td className="num">
					  {r.kredit ? r.kredit.toLocaleString("id-ID") : ""}
					</td>
					<td className="num">
					  {r.saldo.toLocaleString("id-ID")}
					</td>
				  </tr>
				))}
			</tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
