import { getPagination } from "utils/queries";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { limit, offset } = getPagination(req);

  let query = supabase.from("routes").select(
    `
      *,
      setter: setter_id (*),
      repeats: repeats!route_id (*),
      location: location_id (*),
      comments: route_comments (
        *,
        user: user_id (*)
      ),
      reports: route_reports (*)
    `
  );

  if (req.query.max_date) {
    query = query.lte("created_at", req.query.max_date);
  }

  if (req.query.setter_id) {
    query = query.eq("setter_id", req.query.setter_id);
  }

  if (req.query.climber_id) {
    query = query.eq("repeats.user_id", req.query.climber_id);
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
    query = query.ilike("name", `%${q}%`);
  }

  if (req.query.hide_active) {
    query = query.is("active", false);
  }

  if (req.query.hide_archived) {
    query = query.is("active", true);
  }

  if (req.query.hide_official) {
    query = query.is("official", false);
  }

  if (req.query.hide_not_official) {
    query = query.is("official", true);
  }

  query = query
    .order("created_at", { ascending: false })
    .order("created_at", { ascending: false, foreignTable: "route_comments" })
    .range(offset, offset + limit - 1)
    .limit(3, { foreignTable: "route_comments" });

  const { data: routes, error } = await query;

  if (error) {
    return res.status(400).end(error.message);
  }

  res.status(200).json(routes);
};
