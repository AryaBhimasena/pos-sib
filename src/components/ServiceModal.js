/* ======================================================
   SERVICE MODAL DIALOG
   Lokasi: src/components/ServiceModal.js
====================================================== */

"use client";

import { useRef } from "react";

import { useServiceModal } from "@/lib/useServiceModal";

import ServicePreview from "@/components/service/ServicePreview";
import ServiceUsedParts from "@/components/service/ServiceUsedParts";
import ServiceCustomerSection from "@/components/service/ServiceCustomerSection";
import ServiceTotalBiaya from "@/components/service/ServiceTotalBiaya";
import ServicePaymentMethod from "@/components/service/ServicePaymentMethod";
import ServiceNotaSection from "@/components/service/ServiceNotaSection";
import { useServicePreview } from "@/components/service/useServicePreview";
import ServiceNotaPDF from "@/components/service/ServiceNotaPDF";


export default function ServiceModal({
  open,
  onClose,
  serviceData = null,
  mode = "create",
  onSuccess,
}) {
  const {
    form,
    setForm,

    usedParts,
    setUsedParts,

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

    handleChange,
    handleBiayaChange,
    handlePelangganChange,
    handleNamaKeyDown,
    handleHpChange,
    handleSubmit,

    setShowNama,
    setShowHp,
    setActiveNama,
    setActiveHp,
	isHydrated,
	jenisServiceList,
  } = useServiceModal(open, onClose, serviceData, mode, onSuccess);

const normalizePhoneNumber = (value = "") => {
  if (!value) return "";

  let phone = String(value)
    .replace(/\s+/g, "")
    .replace(/-/g, "")
    .replace(/\+/g, "");

  if (phone.startsWith("62")) {
    return phone;
  }

  if (phone.startsWith("0")) {
    return "62" + phone.slice(1);
  }

  return "62" + phone;
};
  
	const { preview } = useServicePreview(form, usedParts);
	const pdfRef = useRef(null);
	
const handleSendWhatsApp = async () => {
  if (!preview || !pdfRef.current || !activeHp) return;

  const normalizedHp = normalizePhoneNumber(activeHp);
  if (!normalizedHp) return;

  const waLink = `https://wa.me/${normalizedHp}`;

  // ⬇️ DYNAMIC IMPORT (AMAN UNTUK NEXT.JS)
  const html2pdf = (await import("html2pdf.js")).default;

  const options = {
    margin: 0,
    filename: `Nota-Service-${preview.nota}.pdf`,
    image: { type: "jpeg", quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
    },
    jsPDF: {
      unit: "mm",
      format: "a5",
      orientation: "landscape",
    },
  };

  await html2pdf()
    .set(options)
    .from(pdfRef.current)
    .toPdf()
    .save(); // generate file di client

  // Redirect ke WhatsApp
  window.location.href = waLink;
};

  if (!open) return null;

  return (
  <>
    <div className="modal-backdrop">
      <div className="modal-container large">

        {/* HEADER */}
        <div className="modal-header">
          <h3>Service Baru</h3>
          <button onClick={onClose}>✕</button>
        </div>

        {/* CONTENT */}
        <div className="modal-content two-column">

          {/* FORM */}
          <div className="service-form">

            {/* DATA NOTA */}
			<ServiceNotaSection
			  form={form}
			  jenisServiceList={jenisServiceList}
			  setForm={setForm}
			  handleBiayaChange={handleBiayaChange}
			  handleChange={handleChange}
			/>

            {/* PELANGGAN */}
            <ServiceCustomerSection
              form={form}
              setForm={setForm}
              merekList={merekList}
              namaList={namaList}
              hpList={hpList}
              showNama={showNama}
              showHp={showHp}
              activeNama={activeNama}
              activeHp={activeHp}
              isNewCustomer={isNewCustomer}
              setIsNewCustomer={setIsNewCustomer}
              handleChange={handleChange}
              handlePelangganChange={handlePelangganChange}
              handleNamaKeyDown={handleNamaKeyDown}
              handleHpChange={handleHpChange}
              setShowNama={setShowNama}
              setShowHp={setShowHp}
              setActiveNama={setActiveNama}
              setActiveHp={setActiveHp}
            />

            {/* PART DIGUNAKAN */}
            <ServiceUsedParts
              open={open}
              value={usedParts}
              onChange={setUsedParts}
			  initialUsedParts={usedParts}
            />

            {/* TOTAL BIAYA SERVICE */}
            <ServiceTotalBiaya
              form={form}
              setForm={setForm}
              usedParts={usedParts}
			  mode={mode}
			  isHydrated={isHydrated}
            />

            {/* METODE PEMBAYARAN */}
            <ServicePaymentMethod
              form={form}
              handleChange={handleChange}
            />

          </div>

          {/* PREVIEW STICKY */}
          <ServicePreview
            sourceForm={form}
            usedParts={usedParts}
          />

        </div>

        {/* FOOTER */}
        <div className="modal-footer">
          <div className="footer-actions full">

			{/* FOOTER KIRI */}
			<div className="footer-left">
			  <div className="footer-group">
				<label>Pilih Teknisi</label>
				<select
				  value={form.idKaryawan}
				  onChange={(e) => {
					const selected = teknisiList.find(
					  (t) => String(t.id) === e.target.value
					);

					setForm({
					  ...form,
					  teknisi: selected?.nama || "",
					  idKaryawan: selected?.id || "",
					});
				  }}
				>
				  <option value="">-- Pilih Teknisi --</option>
				  {teknisiList.map((t) => (
					<option key={t.id} value={t.id}>
					  {t.nama}
					</option>
				  ))}
				</select>
			  </div>

			  <div className="footer-group">
				<label>Status Service</label>
				<select
				  name="statusService"
				  value={form.statusService || "DITERIMA"}
				  onChange={handleChange}
				>
				  <option value="DITERIMA">Diterima</option>
				  <option value="DIAMBIL">Diambil</option>
				  <option value="DIBATALKAN">Dibatalkan</option>
				</select>
			  </div>
			</div>

            {/* FOOTER KANAN */}
            <div className="footer-right">
<button
  className="btn wa"
  onClick={handleSendWhatsApp}
  disabled={!preview || !activeHp}
>
  Kirim WA
</button>

              <button className="btn print">Print</button>
              <button className="btn secondary" onClick={onClose}>
                Batal
              </button>
              <button className="btn primary" onClick={handleSubmit}>
                Simpan
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
	
{/* PDF RENDER (HIDDEN) */}
<div style={{ position: "absolute", left: "-9999px", top: 0 }}>
  <ServiceNotaPDF ref={pdfRef} preview={preview} />
</div>
</>
  );
}
