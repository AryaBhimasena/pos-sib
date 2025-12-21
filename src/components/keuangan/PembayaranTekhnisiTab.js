"use client";

import "@/styles/pages/pembayaran-tekhnisi.css";

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
              <td className="right">Rp {t.totalHak.toLocaleString("id-ID")}</td>
              <td className="right paid">
                Rp {t.sudahDibayar.toLocaleString("id-ID")}
              </td>
              <td className="right unpaid">
                Rp {t.sisa.toLocaleString("id-ID")}
              </td>
              <td>
                <button className="action small">Bayar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
