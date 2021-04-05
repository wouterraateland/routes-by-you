import { supabase } from "utils/supabase";
import { getUser } from "utils/authServer";

export default async (req, res) => {
  const { user, error } = await getUser(req);
  if (error || !user) {
    return res.status(401).end("Not authenticated");
  }

  const { collectionId } = req.query;

  if (req.method === "POST") {
    await supabase.from("collection_bookmarks").insert({
      user_id: user.id,
      collection_id: collectionId,
    });
    return res.status(200).json(true);
  } else if (req.method === "DELETE") {
    await supabase
      .from("collection_bookmarks")
      .delete()
      .eq("user_id", user.id)
      .eq("collection_id", collectionId);
    return res.status(200).json(false);
  }
};
