import { getPagination } from "utils/queries";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { limit, page } = getPagination(req);

  let query = supabase.from("users").select(
    `
      *,
      routes: routes!setter_id (id),
      repeats (id)
    `
  );

  if (req.query.q) {
    const q = req.query.q;
    query.ilike("display_name", `%${q}%`);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit);

  const { data: users, error } = await query;

  if (error) {
    return res.status(400).end(error.message);
  }

  res.status(200).json(users);
};
