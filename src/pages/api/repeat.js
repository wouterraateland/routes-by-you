import { getUser } from "utils/authServer";
import { isNothing } from "utils/functions";
import { between } from "utils/math";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { user, error } = await getUser(req);
  if (error || !user) {
    return res.status(401).end("Not authenticated");
  }

  const value = {
    attempt: isNothing(req.body.attempt) ? null : Math.max(1, req.body.attempt),
    grade: isNothing(req.body.grade)
      ? null
      : between(100, 1000)(req.body.grade),
    rating: isNothing(req.body.rating) ? null : between(0, 5)(req.body.rating),
    video: req.body.video,
  };

  const repeatId = req.body.id;
  if (req.method === "DELETE" && !repeatId) {
    return res.status(400).end("Nothing to delete");
  }
  if (repeatId) {
    // Update existing repeat
    const selectRes = await supabase
      .from("repeats")
      .select("*")
      .eq("id", repeatId)
      .single();
    if (selectRes.error) {
      return res.status(404).end(selectRes.error.message);
    }
    const repeat = selectRes.data;
    if (repeat.user_id !== user.id) {
      return res.status(401).end("Cannot change someone else's repeat");
    }

    if (req.method === "DELETE") {
      const deleteRes = await supabase
        .from("repeats")
        .delete()
        .eq("id", repeatId);
      if (deleteRes.error) {
        return res.status(500).end(deleteRes.error.message);
      }

      return res.status(200).json(repeat);
    }

    if (req.method === "POST") {
      const updateRes = await supabase
        .from("repeats")
        .update(value)
        .eq("id", repeatId);
      if (updateRes.error) {
        return res.status(500).end(updateRes.error.message);
      }

      return res.status(200).json(updateRes.data[0]);
    }
  } else {
    // Create new repeat
    const insertRes = await supabase.from("repeats").insert([
      {
        route_id: req.body.route_id,
        user_id: user.id,
        ...value,
      },
    ]);
    if (insertRes.error) {
      return res.status(500).end(insertRes.error.message);
    }

    return res.status(200).json(insertRes.data[0]);
  }
};
