import { getUser } from "utils/authServer";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { user, error } = await getUser(req);
  if (error || !user) {
    return res.status(401).end("Not authenticated");
  }

  const { routeId } = req.body;

  const { data: reports, error: selectError } = await supabase
    .from("route_reports")
    .select("*")
    .eq("user_id", user.id)
    .eq("route_id", routeId);

  if (selectError) {
    return res.status(400).end(selectError.message);
  }

  if (req.method === "DELETE") {
    if (!reports) {
      return res
        .status(403)
        .end("You haven't reported this route as broken yet");
    }
    const deleteRes = await supabase
      .from("route_reports")
      .delete()
      .in(
        "id",
        reports.map(({ id }) => id)
      );
    if (deleteRes.error) {
      return res.status(500).end(deleteRes.error.message);
    }

    return res.status(200).json({ message: "Report deleted successfully" });
  }

  if (req.method === "POST") {
    if (reports.length > 0) {
      return res
        .status(403)
        .end("You have already reported this route as broken");
    }
    const insertRes = await supabase
      .from("route_reports")
      .insert([{ user_id: user.id, route_id: routeId }]);
    if (insertRes.error) {
      return res.status(500).end(insertRes.error.message);
    }

    return res.status(200).json({ message: "Report successful" });
  }

  return res.status(405).end("Method not allowed");
};
