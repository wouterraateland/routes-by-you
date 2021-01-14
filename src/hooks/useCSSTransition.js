import { useEffect, useRef } from "react";

const defaultClassNames = {
  enter: "enter",
  enterActive: "enter-active",
  enterDone: "enter-done",
  exit: "exit",
  exitActive: "exit-active",
  exitDone: "exit-done",
};

export default function useCSSTransition(
  flag,
  { ref, timeout, appear, classNames = defaultClassNames }
) {
  const innerRef = useRef(null);
  const stateRef = useRef(appear ? "appear" : "enter");

  const actualRef = ref || innerRef;

  useEffect(() => {
    if (actualRef.current) {
      actualRef.current.style.transitionDuration = `${timeout}ms`;
      let t1 = null;
      let t2 = null;
      if (flag) {
        if (stateRef.current.startsWith("enter")) {
          if (
            ![
              classNames.enter,
              classNames.enterActive,
              classNames.enterDone,
            ].some((className) =>
              actualRef.current.className.includes(className)
            )
          ) {
            actualRef.current.classList.add(classNames.enterDone);
          }
        } else {
          stateRef.current = "enter";
          actualRef.current.classList.remove(
            classNames.exit,
            classNames.exitActive,
            classNames.exitDone
          );
          actualRef.current.classList.add(classNames.enter);
          t1 = setTimeout(() => {
            if (actualRef.current) {
              actualRef.current.classList.remove(classNames.enter);
              actualRef.current.classList.add(classNames.enterActive);
              t2 = setTimeout(() => {
                if (actualRef.current) {
                  actualRef.current.classList.remove(classNames.enterActive);
                  actualRef.current.classList.add(classNames.enterDone);
                }
              }, timeout);
            }
          }, 10);
        }
      } else {
        if (stateRef.current.startsWith("exit")) {
          if (
            ![
              classNames.exit,
              classNames.exitActive,
              classNames.exitDone,
            ].some((className) =>
              actualRef.current.className.includes(className)
            )
          ) {
            actualRef.current.classList.add(classNames.exitDone);
          }
        } else {
          stateRef.current = "exit";
          actualRef.current.classList.remove(
            classNames.enter,
            classNames.enterActive,
            classNames.enterDone
          );
          actualRef.current.classList.add(classNames.exit);
          t1 = setTimeout(() => {
            if (actualRef.current) {
              actualRef.current.classList.remove(classNames.exit);
              actualRef.current.classList.add(classNames.exitActive);
              t2 = setTimeout(() => {
                if (actualRef.current) {
                  actualRef.current.classList.remove(classNames.exitActive);
                  actualRef.current.classList.add(classNames.exitDone);
                }
              }, timeout);
            }
          }, 10);
        }
      }
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [flag, actualRef, timeout]);

  return actualRef;
}
