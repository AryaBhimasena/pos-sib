"use client";

import { useState } from "react";
import "@/styles/pages/pembayaran-tekhnisi.css";
import FormPembayaranTeknisi from "@/components/keuangan/formPembayaranTeknisi";

const dummyTeknisi = [
  {
    id: "T001",
    nama: "Andi Saputra",
    totalHak: 390000,
    sudahDibayar: 250000,
    sisa: 140000,
  },
  {
    id: "T002",
    nama: "Budi Santoso",
    totalHak: 300000,
    sudahDibayar: 300000,
    sisa: 0,
  },
];

export default function PembayaranTeknisiTab() {
  const [showForm, setShowForm] = useState(false);
  const [selectedTeknisi, setSelectedTeknisi] = useState(null);

  const handleOpenForm = teknisi => {
    if (teknisi.sisa <= 0) return;
    setSelectedTeknisi(teknisi);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTeknisi(null);
  };

  const handleSubmitPembayaran = payload => {
    console.log("Payload pembayaran:", payload);

    // NANTI:
    // - POST ke endpoint GAS
    // - update state / refetch data

    handleCloseForm();
  };

  return (
    <div className="tab-content">
      <h3>Pembayaran Teknisi</h3>
      <p className="section-desc">
        Pencatatan pembayaran bagi hasil teknisi (harian, mingguan, bulanan)
      </p>

      <table className="keuangan-table">
        <thead>
          <tr>
            <th>Teknisi</th>
            <th className="right">Total Hak</th>
            <th className="right">Sudah Dibayar</th>
            <th className="right">Sisa</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dummyTeknisi.map(t => (
            <tr key={t.id}>
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
              <td>
                <button
                  className="action small"
                  disabled={t.sisa <= 0}
                  onClick={() => handleOpenForm(t)}
                >
                  Bayar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

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
