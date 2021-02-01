import { api } from "utils/api";
import { Cache } from "utils/caching";

import useResource from "hooks/useResource";

import PagedResource from "resources/PagedResource";

import InfiniteList from "components/ui/InfiniteList";
import User from "components/User";

const usersCache = new Cache();

const renderUser = (user) => <User key={user.id} user={user} />;

export default function UserList({
  filters,
  limit = 10,
  maxLength = Infinity,
}) {
  const filter = Object.keys(filters)
    .filter((key) => Boolean(filters[key]))
    .map((key) => `${key}=${filters[key]}`)
    .join("&");
  const usersResource = usersCache.read(filter, () => {
    return new PagedResource(limit, (offset, limit) =>
      api
        .get(`users?${filter}&offset=${offset}&limit=${limit}`)
        .then((data) => ({ data, hasNext: data.length > 0 }))
    );
  });

  const users = useResource(usersResource);
  const visibleUsers = users.slice(0, maxLength);
  return (
    <div className="divide-y sm:space-y-2 sm:divide-y-0 border-t border-b sm:border-0">
      {visibleUsers.length === 0 && !usersResource.hasNext && (
        <p className="text-center text-gray-500">No users found</p>
      )}
      <InfiniteList
        items={visibleUsers}
        renderItem={renderUser}
        pageSize={limit}
        loadPage={
          users.length < maxLength && usersResource.hasNext
            ? () => usersResource.fetchNextPage()
            : undefined
        }
      />
    </div>
  );
}
