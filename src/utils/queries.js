import { between } from "utils/math";

const maxLimit = 100;

export function getPagination(req) {
  const reqLimit = parseInt(req.query.limit, 10);
  const reqPage = parseInt(req.query.page, 10);

  const page = isNaN(reqPage) ? 0 : Math.max(0, reqPage);
  const limit = isNaN(reqLimit) ? between(1, maxLimit)(maxLimit) : reqLimit;

  return { page, limit };
}
