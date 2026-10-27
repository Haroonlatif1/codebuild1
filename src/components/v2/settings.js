import { useEffect, useState } from "react";
import { supabase } from "../supabase/SupabaseClient";
import { WHY_CHOOSE } from "../../config/content";

let cache = null, pending = null;
const load = () => cache ? Promise.resolve(cache) : (pending ||= supabase.from("site_settings").select("*").then(
  ({ data }) => (cache = Object.fromEntries((data || []).map(r => [r.key, r.value]))), () => (cache = {})));

/** Reads admin-controlled settings (table site_settings). */
export const useSetting = (key, fallback = null) => {
  const [v, setV] = useState(cache ? (cache[key] ?? fallback) : fallback);
  useEffect(() => { let on = true; load().then(c => on && setV(c[key] ?? fallback)); return () => { on = false; }; }, [key]); // eslint-disable-line
  return v;
};
export const useWhyChoose = () => {
  const s = useSetting("why_choose", null);
  return Array.isArray(s?.items) && s.items.length ? s.items : WHY_CHOOSE;
};
