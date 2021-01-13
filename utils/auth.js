import { RedirectError } from "utils/errors";

export function isAuthenticated(auth) {
  return !!auth.user;
}

export function isNotAuthenticated(auth) {
  return !auth.user;
}

export function redirectIfNotAuthenticated(auth, to = "/auth/login") {
  if (!auth.user) {
    throw new RedirectError(to);
  }
}

export function redirectIfAuthenticated(auth, to = "/admin") {
  if (auth.user) {
    throw new RedirectError(to);
  }
}
