// src/lib/api.js

export const API_URL =
  "https://script.google.com/macros/s/AKfycbzEaIDU2yR8AxJlyupr9SZ2VBfBB2C4h_Uti70HCK455R8ohsIJPLk_aB70ydTDAt2phw/exec";

/**
 * Helper fetch POST ke Apps Script
 */
export async function postAPI(path, payload = {}) {
  const res = await fetch(`${API_URL}?path=${path}`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.json();
}
