"use client";



export default function HutangSupplierTab() {
  return (
    <div className="tab-content">
      <h3>Hutang Supplier</h3>
      <p className="section-desc">
        Monitoring kewajiban pembelian part ke supplier
      </p>

      <table className="keuangan-table">
        <thead>
          <tr>
            <th>Supplier</th>
            <th className="right">Total Hutang</th>
            <th className="right">Sudah Dibayar</th>
            <th className="right">Sisa</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>PT Sumber Jaya Parts</td>
            <td className="right">1.200.000</td>
            <td className="right">700.000</td>
            <td className="right unpaid">500.000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
