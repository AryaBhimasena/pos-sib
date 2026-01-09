/* ======================================================
   USE SERVICE MODAL HOOK
   Lokasi: lib/useServiceModal.js
====================================================== */

import { useServiceState } from "@/lib/service/state";
import { useServiceEffects } from "@/lib/service/effects";
import { useCustomerHandlers } from "@/lib/service/handlersCustomer";
import { useBarangHandlers } from "@/lib/service/handlersBarang";
import { useServiceSubmit } from "@/lib/service/submit";

export function useServiceModal(
  open,
  onClose,
  serviceData,
  mode,
  onSuccess
) {
  const state = useServiceState();

  useServiceEffects(open, state, serviceData, mode);

  const customer = useCustomerHandlers(state);
  const barang = useBarangHandlers(state);
  const submit = useServiceSubmit(state, onClose, mode, onSuccess);

  return {
    ...state,
    ...customer,
    ...barang,
    ...submit,
  };
}
