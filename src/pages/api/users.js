import { getPagination } from "utils/queries";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { limit, offset } = getPagination(req);

  let query = supabase.from("users").select(
    `
      *,
      routes: routes!setter_id (id),
      repeats: repeats!user_id (id)
    `
  );

  if (req.query.q) {
    const q = req.query.q;
    query.ilike("display_name", `%${q}%`);
  } else {
    query.neq("display_name", "");
  }

  query = query
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  const { data: users, error } = await query;

  if (error) {
    return res.status(400).end(error.message);
  }

  res.status(200).json(users);
};
