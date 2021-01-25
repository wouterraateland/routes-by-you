import { getPagination } from "utils/queries";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { limit, page } = getPagination(req);

  let query = supabase.from("locations").select(
    `
      *,
      routes: routes!location_id (id)
    `
  );

  if (req.query.q) {
    const q = req.query.q;
    query.ilike("name", `%${q}%`);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  const { data: locations, error } = await query;

  if (error) {
    return res.status(400).end(error.message);
  }

  res.status(200).json(locations);
};
