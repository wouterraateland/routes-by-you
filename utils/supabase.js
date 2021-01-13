import { createClient } from "@supabase/supabase-js";
import SupabaseListResource from "resources/SupabaseListResource";
import SupabaseObjectResource from "resources/SupabaseObjectResource";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_API_URL,
  typeof window === "undefined"
    ? process.env.SUPABASE_SERVICE_KEY
    : process.env.NEXT_PUBLIC_SUPABASE_API_KEY
);

export const supabaseResourceCache = new Map();

const createSupabaseResource = (query, single) => {
  const model = query.url.pathname.replace("/rest/v1/", "");
  if (single) {
    switch (model) {
      default:
        return new SupabaseObjectResource(query);
    }
  } else {
    switch (model) {
      default:
        return new SupabaseListResource(query);
    }
  }
};

const defaultOptions = {
  single: false,
  refreshIfExists: false,
};
export const getSupabaseResource = (query, options) => {
  const { single, refreshIfExists } = { ...defaultOptions, ...options };
  const key = query.url.href;

  if (!supabaseResourceCache.has(key)) {
    supabaseResourceCache.set(key, createSupabaseResource(query, single));
  } else if (refreshIfExists) {
    supabaseResourceCache.get(key).refresh();
  }
  return supabaseResourceCache.get(key);
};

if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  window.supabaseResourceCache = supabaseResourceCache;
  window.supabase = supabase;
}
