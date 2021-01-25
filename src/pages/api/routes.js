import { getPagination } from "utils/queries";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { limit, page } = getPagination(req);

  let query = supabase.from("routes").select(
    `
      *,
      setter: setter_id (*),
      repeats (*),
      location: location_id (*),
      comments: route_comments (*),
      reports: route_reports (*)
    `
  );

  if (req.query.max_date) {
    query = query.lte("created_at", req.query.max_date);
  }

  if (req.query.setter_id) {
    query = query.eq("setter_id", req.query.setter_id);
  }

  if (req.query.location_id) {
    query = query.eq("location_id", req.query.location_id);
  }

  if (req.query.min_grade) {
    query = query.gte("grade", req.query.min_grade);
  }

  if (req.query.max_grade) {
    query = query.lte("grade", req.query.max_grade);
  }

  if (req.query.q) {
    const q = req.query.q;
    query.ilike("name", `%${q}%`);
  }

  query = query
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  const { data: routes, error } = await query;

  if (error) {
    return res.status(400).end(error.message);
  }

  res.status(200).json(routes);
};
