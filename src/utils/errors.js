export class RedirectError extends Error {
  constructor(to) {
    super(`Redirect to ${to}`);
    this.name = "RedirectError";
    this.to = to;
  }
}
