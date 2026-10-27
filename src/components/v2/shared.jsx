import React, { useRef, useState } from "react";
import { supabase } from "../supabase/SupabaseClient";
import { SITE } from "../../config/siteConfig";

export const MAX_MB = 5;

/** Accepts only genuine JPEG files (checks MIME/extension AND the FF D8 FF signature). */
export async function validateJpeg(file) {
  if (!file) return "Please upload your payment screenshot.";
  const okName = /\.(jpe?g)$/i.test(file.name);
  if (file.type !== "image/jpeg" || !okName) return "Only JPEG (.jpg / .jpeg) screenshots are accepted.";
  if (file.size > MAX_MB * 1024 * 1024) return `Screenshot must be under ${MAX_MB} MB.`;
  const head = new Uint8Array(await file.slice(0, 3).arrayBuffer());
  if (!(head[0] === 0xff && head[1] === 0xd8 && head[2] === 0xff)) return "This file is not a valid JPEG image.";
  return "";
}

/** Uploads proof to Supabase Storage (bucket: payment-proofs). Returns public URL or "". */
export async function uploadProof(file, folder) {
  try {
    const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.jpg`;
    const { error } = await supabase.storage.from("payment-proofs").upload(path, file, { contentType: "image/jpeg" });
    if (error) return "";
    return supabase.storage.from("payment-proofs").getPublicUrl(path).data.publicUrl || "";
  } catch { return ""; }
}

/** Sends the notification email via Web3Forms (same service the old form used). */
export async function sendWeb3(fields, file) {
  const fd = new FormData();
  fd.append("access_key", SITE.web3formsKey);
  Object.entries(fields).forEach(([k, v]) => fd.append(k, v ?? ""));
  if (file) fd.append("attachment", file, file.name);
  const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
  return res.json();
}

export const Tick = () => (
  <svg className="tick" viewBox="0 0 100 100" role="img" aria-label="Success">
    <circle cx="50" cy="50" r="45" /><path d="M30 52l14 14 27-30" />
  </svg>
);

export const Stars = ({ value = 0, size }) => (
  <span className="sh-stars" role="img" aria-label={`${value} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(i => (
      <svg key={i} viewBox="0 0 20 20" style={size ? { width: size, height: size } : null}>
        <path d="M10 1.5l2.6 5.6 6 .7-4.5 4.1 1.3 6L10 14.9 4.6 17.9l1.3-6L1.4 7.8l6-.7z"
          fill={i <= Math.round(value) ? "#ffa500" : "none"} stroke="#ffa500" strokeWidth="1.2" />
      </svg>
    ))}
  </span>
);

/** JPEG drop-zone with preview. */
export const JpegDrop = ({ file, onFile, error, id = "proof" }) => {
  const ref = useRef();
  const [over, setOver] = useState(false);
  const url = file ? URL.createObjectURL(file) : "";
  const pick = (f) => f && onFile(f);
  if (file) return (
    <div className="drop-prev">
      <img src={url} alt="Payment screenshot preview" onLoad={() => URL.revokeObjectURL(url)} />
      <div>{file.name}<small>{(file.size / 1024).toFixed(0)} KB · JPEG</small></div>
      <button type="button" onClick={() => onFile(null)}>Remove</button>
    </div>
  );
  return (
    <>
      <div className={`drop${over ? " over" : ""}${error ? " err" : ""}`} role="button" tabIndex={0}
        onClick={() => ref.current.click()} onKeyDown={e => (e.key === "Enter" || e.key === " ") && ref.current.click()}
        onDragOver={e => { e.preventDefault(); setOver(true); }} onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); pick(e.dataTransfer.files[0]); }}>
        <strong>Upload payment screenshot</strong>
        <span>JPEG only (.jpg / .jpeg) · max {MAX_MB} MB · click or drag here</span>
        <input ref={ref} id={id} type="file" accept="image/jpeg,.jpg,.jpeg" hidden onChange={e => pick(e.target.files[0])} />
      </div>
      {error && <div className="v2-err">{error}</div>}
    </>
  );
};
