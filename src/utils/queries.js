import { between } from "utils/math";

const maxLimit = 100;

export function getPagination(req) {
  const reqLimit = parseInt(req.query.limit, 10);
  const reqOffset = parseInt(req.query.offset, 10);

  const offset = isNaN(reqOffset) ? 0 : Math.max(0, reqOffset);
  const limit = isNaN(reqLimit) ? between(1, maxLimit)(maxLimit) : reqLimit;

  return { offset, limit };
}
