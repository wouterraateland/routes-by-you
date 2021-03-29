import { v4 as uuidv4 } from "uuid";
import { getUser } from "utils/authServer";
import { between } from "utils/math";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { user, error } = await getUser(req);
  if (error || !user) {
    return res.status(401).end("Not authenticated");
  }

  const value = {
    name: req.body.name,
    description: req.body.description,
    holds: req.body.holds,
    image: req.body.image,
    grade: req.body.grade ? between(100, 1000)(req.body.grade || 100) : null,
    location_id: req.body.location_id,
    location_string: req.body.location_string,
    geometry: Array.isArray(req.body.geometry)
      ? `Point(${req.body.geometry.join(" ")})`
      : null,
  };

  const routeId = req.body.id;
  if (req.method === "DELETE" && !routeId) {
    return res.status(400).end("Nothing to delete");
  }
  if (routeId) {
    // Update existing route
    const selectRes = await supabase
      .from("routes")
      .select("*")
      .eq("id", routeId)
      .single();
    if (selectRes.error) {
      return res.status(404).end(selectRes.error.message);
    }
    const route = selectRes.data;
    if (route.setter_id !== user.id) {
      return res.status(401).end("Cannot change someone else's route");
    }

    if (req.method === "DELETE") {
      const repDeleteRes = await supabase
        .from("repeats")
        .delete()
        .eq("route_id", routeId);
      if (repDeleteRes.error) {
        return res.status(500).end(repDeleteRes.error.message);
      }
      const deleteRes = await supabase
        .from("routes")
        .delete()
        .eq("id", routeId);
      if (deleteRes.error) {
        return res.status(500).end(deleteRes.error.message);
      }

      return res.status(200).json(route);
    }

    if (req.method === "POST") {
      const updateRes = await supabase
        .from("routes")
        .update(value)
        .eq("id", routeId);
      if (updateRes.error) {
        return res.status(500).end(updateRes.error.message);
      }

      return res.status(200).json(updateRes.data[0]);
    }
  } else {
    // Create new route
    const insertRes = await supabase.from("routes").insert([
      {
        id: uuidv4(),
        setter_id: user.id,
        ...value,
      },
    ]);
    if (insertRes.error) {
      return res.status(500).end(insertRes.error.message);
    }

    return res.status(200).json(insertRes.data[0]);
  }
};
