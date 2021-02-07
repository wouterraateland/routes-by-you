import { getUser } from "utils/authServer";
import { supabase } from "utils/supabase";

export default async (req, res) => {
  const { user, error } = await getUser(req);
  if (error || !user) {
    return res.status(401).end("Not authenticated");
  }

  const value = { text: req.body.text };

  const commentId = req.body.id;
  if (req.method === "DELETE" && !commentId) {
    return res.status(400).end("Nothing to delete");
  }
  if (commentId) {
    // Update existing comment
    const selectRes = await supabase
      .from("route_comments")
      .select("*")
      .eq("id", commentId)
      .single();
    if (selectRes.error) {
      return res.status(404).end(selectRes.error.message);
    }
    const comment = selectRes.data;
    if (comment.user_id !== user.id) {
      return res.status(401).end("Cannot change someone else's comment");
    }

    if (req.method === "DELETE") {
      const deleteRes = await supabase
        .from("route_comments")
        .delete()
        .eq("id", commentId);
      if (deleteRes.error) {
        return res.status(500).end(deleteRes.error.message);
      }

      return res.status(200).json(comment);
    }

    if (req.method === "POST") {
      const updateRes = await supabase
        .from("route_comments")
        .update(value)
        .eq("id", commentId);
      if (updateRes.error) {
        return res.status(500).end(updateRes.error.message);
      }

      return res.status(200).json(updateRes.data[0]);
    }
  } else {
    // Create new comment
    const insertRes = await supabase.from("route_comments").insert([
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
