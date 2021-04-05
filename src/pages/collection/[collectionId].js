import { Router } from "next/router";

import { api } from "utils/api";
import { supabase } from "utils/supabase";

import { useState } from "react";

import Head from "next/head";
import Link from "next/link";
import Arrow from "components/icons/Arrow";
import Bookmark from "components/icons/Bookmark";
import Check from "components/icons/Check";
import Repeat from "components/icons/Repeat";
import Avatar from "components/ui/Avatar";
import Button from "components/ui/Button";
import Card from "components/ui/Card";
import RouteList from "components/RouteList";

export default function CollectionPage({ collection, auth }) {
  const [bookmarked, setBookmarked] = useState(
    collection.bookmarks.some((bookmark) => bookmark.user_id === auth.user.id)
  );
  const routesTopped = 1;
  const allTopped = routesTopped >= collection.collection_routes.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>{`${collection.title} | Routes by You`}</title>
      </Head>
      <div className="max-w-xl mx-auto py-4 space-y-4 sm:space-y-8">
        <div className="flex px-4 sm:px-0">
          <Button
            onClick={() => Router.back()}
            className="rounded-md p-2"
            bgColor="white"
          >
            <Arrow className="h-4" direction="left" />
          </Button>
        </div>
        <div className="flex items-start justify-between px-4 sm:px-0">
          <div>
            <h1 className="text-4xl font-bold">{collection.title}</h1>
            {collection.description && (
              <p className="text-lg text-gray-500">{collection.description}</p>
            )}
            <div className="flex flex-wrap items-center -mx-1 my-2 text-gray-500">
              <Link href={`/user/${collection.owner.id}`}>
                <a className="mx-1 inline-flex space-x-2 items-center text-blue-600 font-bold hover:underline">
                  <Avatar
                    className="w-6 h-6"
                    src={collection.owner.avatar}
                    alt={collection.owner.display_name}
                  />
                  <span>{collection.owner.display_name}</span>
                </a>
              </Link>
              {collection.bookmarks.length > 0 && (
                <>
                  <span className="mx-1">•</span>
                  <span className="mx-1">
                    bookmarked {collection.bookmarks.length}x
                  </span>
                </>
              )}
            </div>
          </div>
          <div>
            <Button
              className="p-2 rounded-md"
              bgColor="white"
              onClick={async () => {
                await api.request(`collection/${collection.id}/bookmark`, {
                  method: bookmarked ? "DELETE" : "POST",
                });
                setBookmarked(!bookmarked);
              }}
              hint={
                bookmarked ? "Collection bookmarked" : "Bookmark collection"
              }
            >
              <Bookmark
                className={["h-6", bookmarked && "text-green-500"]}
                filled={bookmarked}
              />
            </Button>
          </div>
        </div>
        {collection.collection_routes.length > 0 && (
          <div className="flex justify-center">
            <Card
              elevation="md"
              className={[
                "flex items-center space-x-2 px-4 py-2",
                allTopped
                  ? "bg-green-100 text-green-600"
                  : "bg-blue-100 text-blue-600",
              ]}
            >
              {allTopped ? (
                <Check className="h-4" strokeWidth={4} />
              ) : (
                <Repeat className="h-4" strokeWidth={4} />
              )}
              <p className="font-bold">
                {allTopped
                  ? "All"
                  : `${routesTopped} / ${collection.collection_routes.length}`}{" "}
                routes topped
              </p>
            </Card>
          </div>
        )}
        <RouteList filters={{ collectionId: collection.id }} />
      </div>
    </div>
  );
}
CollectionPage.authPolicy = {
  isAuthorized: (auth) => auth.user,
  redirect: "/auth/login",
};

export async function getServerSideProps({ params }) {
  const { collectionId } = params;

  const { data, error } = await supabase
    .from("collections")
    .select(
      `
      *,
      bookmarks: collection_bookmarks (*),
      collection_routes (*),
      owner: owner_id (*)
    `
    )
    .eq("id", collectionId)
    .single();
  if (error) {
    console.error(error);
    return { notFound: true };
  }

  return { props: { collection: data } };
}