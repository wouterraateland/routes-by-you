export const appear = {
  enter: "opacity-0",
  enterActive: "opacity-100",
  enterDone: "opacity-100",
  exit: "opacity-100",
  exitActive: "opacity-0",
  exitDone: "opacity-0",
};

export const fromBottom = {
  enter: "translate-y-full",
  enterActive: "translate-y-0",
  enterDone: "translate-y-0",
  exit: "translate-y-0",
  exitActive: "translate-y-full",
  exitDone: "translate-y-full",
};

export const fromTop = {
  enter: "-translate-y-full",
  enterActive: "translate-y-0",
  enterDone: "translate-y-0",
  exit: "translate-y-0",
  exitActive: "-translate-y-full",
  exitDone: "-translate-y-full",
};
