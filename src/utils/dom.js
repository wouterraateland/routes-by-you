import { maybe, compose, snd, toPair } from "utils/functions";

export const getCurrentDataProps = ({ isCurrent, isPartiallyCurrent }) =>
  Object.entries({
    "data-current": isCurrent,
    "data-partially-current": isPartiallyCurrent,
  }).reduce(
    (acc, [key, value]) => (value ? { ...acc, [key]: value } : acc),
    {}
  );

export const getScroll = (node) =>
  node
    ? {
        scrollTop: node.scrollTop,
        scrollLeft: node.scrollLeft,
      }
    : { scrollTop: 0, scrollLeft: 0 };

export const getWindowScroll = () => getScroll(document.documentElement);

export const getOffset = maybe(
  () => ({ left: 0, top: 0 }),
  compose(
    ([el, { left, top }]) => ({
      left: left + el.offsetLeft,
      top: top + el.offsetTop,
    }),
    snd((el) => getOffset(el.offsetParent)),
    toPair
  )
);

export const getPositionOnElement = compose(
  ({ left, top }) => (x, y) => ({
    x: x - left,
    y: y - top,
  }),
  getOffset
);

export const isChildOf = (child, parent) =>
  !!(child && parent) &&
  (child === parent || isChildOf(child.parentElement, parent));
