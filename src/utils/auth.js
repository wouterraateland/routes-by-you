import Router from "next/router";

export function isAuthenticated(auth) {
  return !!auth.user;
}

export function isNotAuthenticated(auth) {
  return !auth.user;
}

export function redirectIfNotAuthenticated(auth, to = "/auth/login") {
  if (!auth.user) {
    Router.replace(to);
  }
}

export function redirectIfAuthenticated(auth, to = "/feed") {
  if (auth.user) {
    Router.replace(to);
  }
}
