import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { routeId } = req.query;

  const { data: route, error } = await supabase
    .from("routes")
    .select(
      `
        *,
        setter: setter_id (*),
        repeats: repeats!route_id (
          *,
          user: user_id (*)
        ),
        location: location_id (*),
        comments: route_comments (
          *,
          user: user_id (*)
        ),
        reports: route_reports (*)
      `
    )
    .eq("id", routeId)
    .order("created_at", { ascending: false, foreignTable: "route_comments" })
    .single();
  if (error) {
    return res.status(400).end(error.message);
  }

  return res.status(200).json(route);
};
