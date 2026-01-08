"use client";

import React, { useState, useEffect } from "react";
import "@/styles/pages/pembayaran-tekhnisi.css";
import FormPembayaranTeknisi from "@/components/keuangan/formPembayaranTeknisi";
import { postAPI } from "@/lib/api";

export default function PembayaranTeknisiTab() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTeknisi, setSelectedTeknisi] = useState(null);
  const [listTeknisi, setListTeknisi] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openedDetailId, setOpenedDetailId] = useState(null);
  const [logPembayaran, setLogPembayaran] = useState({});


  // ==========================
  // FETCH DATA HAK TEKNISI
  // ==========================
const fetchHakTeknisi = async () => {
  setLoading(true);
  try {
    const res = await postAPI("get-hak-teknisi");

    console.log("RAW RESPONSE:", res);

    if (!res || res.status !== "OK" || !Array.isArray(res.data)) {
      console.error("FORMAT RESPONSE SALAH:", res);
      setListTeknisi([]);
      return;
    }

    const mapped = res.data.map(t => ({
      id: t.idKaryawan,
      nama: t.namaKaryawan || "-",
      totalHak: Number(t.totalHak || 0),
      sudahDibayar: Number(t.totalDibayar || 0),
      sisa: Number(t.sisaHak || 0)
    }));

    console.log("MAPPED TEKNISI:", mapped);
    setListTeknisi(mapped);
  } catch (err) {
    console.error("Error fetch HakTeknisi:", err);
    setListTeknisi([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchHakTeknisi();
  }, []);

  // ==========================
  // FORM HANDLER
  // ==========================
  const handleOpenForm = teknisi => {
    if (teknisi.sisa <= 0) return;
    setSelectedTeknisi(teknisi);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTeknisi(null);
  };

const handleSubmitPembayaran = async payload => {
  console.log("Payload diterima parent:", payload);

  try {
    const res = await postAPI("bayar-hak-teknisi", {
      idKaryawan: payload.idKaryawan,
      jumlahBayar: payload.jumlahBayar,
      metodeBayar: payload.metodeBayar,
      keterangan: payload.keterangan || "",
      refPeriode: payload.refPeriode || ""
    });

    console.log("RESP API BAYAR TEKNISI:", res);

    if (!res || res.status !== "OK") {
      alert(res?.data?.message || "Gagal menyimpan pembayaran");
      return;
    }

    // refresh list strip
    await fetchHakTeknisi();

    // reset detail agar fetch ulang saat dibuka
    setLogPembayaran({});
    setOpenedDetailId(null);

    // tutup form
    handleCloseForm();
  } catch (err) {
    console.error("Error bayar teknisi:", err);
    alert("Terjadi kesalahan saat menyimpan pembayaran");
  }
};

const formatDateDMY = value => {
  if (!value) return "-";

  // jika sudah Date
  const date =
    value instanceof Date
      ? value
      : typeof value === "number"
      ? new Date(value)
      : new Date(value);

  if (isNaN(date.getTime())) return "-";

  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();

  return `${dd}-${mm}-${yyyy}`;
};

const handleToggleDetail = async teknisi => {
  if (openedDetailId === teknisi.id) {
    setOpenedDetailId(null);
    return;
  }

  setOpenedDetailId(teknisi.id);

  if (!logPembayaran[teknisi.id]) {
    try {
      const res = await postAPI("get-log-pembayaran-teknisi", {
        idKaryawan: teknisi.id
      });

if (res.status === "OK") {
  const normalized = Array.isArray(res.data)
    ? res.data.map(item => ({
        ...item,
        tanggal: formatDateDMY(item.tanggal)
      }))
    : [];

  setLogPembayaran(prev => ({
    ...prev,
    [teknisi.id]: normalized
  }));

      }
    } catch (err) {
      console.error("Gagal ambil log pembayaran", err);
    }
  }
};

  return (
    <div className="tab-content">
      <h3>Pembayaran Teknisi</h3>
      <p className="section-desc">
        Pencatatan pembayaran bagi hasil teknisi (harian, mingguan, bulanan)
      </p>

      {loading ? (
        <p>Loading data teknisi...</p>
      ) : (
        <table className="keuangan-table">
          <thead>
            <tr>
              <th>Teknisi</th>
              <th className="right">Total Hak</th>
              <th className="right">Sudah Dibayar</th>
              <th className="right">Sisa</th>
              <th className="aksi-col">Aksi</th>
            </tr>
          </thead>
<tbody>
  {listTeknisi.map(t => (
    <React.Fragment key={t.id}>
      {/* ROW UTAMA */}
      <tr className="strip-row">
        <td>{t.nama}</td>
        <td className="right">
          Rp {t.totalHak.toLocaleString("id-ID")}
        </td>
        <td className="right paid">
          Rp {t.sudahDibayar.toLocaleString("id-ID")}
        </td>
        <td className="right unpaid">
          Rp {t.sisa.toLocaleString("id-ID")}
        </td>
        <td className="actions">
          <button
            className="action small ghost"
            onClick={() => handleToggleDetail(t)}
          >
            {openedDetailId === t.id ? "Close" : "Detail"}
          </button>

          <button
            className="action small"
            disabled={t.sisa <= 0}
            onClick={() => handleOpenForm(t)}
          >
            Bayar
          </button>
        </td>
      </tr>

      {/* ROW DETAIL */}
      {openedDetailId === t.id && (
        <tr className="detail-row">
          <td colSpan={5}>
            <div className="detail-box">
			  {(!logPembayaran[t.id] ||
				logPembayaran[t.id].length === 0) ? (
				<p className="empty">Belum ada riwayat pembayaran</p>
			  ) : (
				<table className="detail-ledger">
				  <thead>
					<tr>
					  <th>Tanggal</th>
					  <th>Keterangan</th>
					  <th>Metode</th>
					  <th className="right">Nominal</th>
					</tr>
				  </thead>
				  <tbody>
					{logPembayaran[t.id].map(log => (
					  <tr key={log.id}>
						<td>{log.tanggal}</td>
						<td>{log.keterangan || "-"}</td>
						<td>{log.metodeBayar}</td>
						<td className="right">
						  Rp {log.nominal.toLocaleString("id-ID")}
						</td>
					  </tr>
					))}
				  </tbody>
				</table>
			  )}
			</div>
          </td>
        </tr>
      )}
    </React.Fragment>
  ))}
</tbody>

        </table>
      )}

      {showForm && selectedTeknisi && (
        <FormPembayaranTeknisi
          teknisi={selectedTeknisi}
          onClose={handleCloseForm}
          onSubmit={handleSubmitPembayaran}
        />
      )}
    </div>
  );
}
