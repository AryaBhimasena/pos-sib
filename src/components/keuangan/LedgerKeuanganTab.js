"use client";



export default function LedgerKeuanganTab() {
  return (
    <div className="tab-content">
      <h3>Ledger Keuangan</h3>
      <p className="section-desc">
        Riwayat keluar masuk kas outlet
      </p>

      <table className="keuangan-table">
        <thead>
          <tr>
            <th>Tanggal</th>
            <th>Deskripsi</th>
            <th className="right">Debit</th>
            <th className="right">Kredit</th>
            <th className="right">Saldo</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>2025-12-10</td>
            <td>Pembayaran Teknisi - Andi</td>
            <td className="right">-</td>
            <td className="right">250.000</td>
            <td className="right">1.250.000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
