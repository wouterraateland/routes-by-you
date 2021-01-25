import React, { forwardRef, useEffect, useMemo, useRef, useState } from "react";

import Loader from "components/ui/Loader";

function LoaderComponentImpl(props, ref) {
  return (
    <div ref={ref} {...props} className="mx-auto my-4">
      <Loader className="text-blue-600" />
    </div>
  );
}
const LoaderComponent = forwardRef(LoaderComponentImpl);

const defaultComponents = {
  Container: React.Fragment,
  Loader: LoaderComponent,
};

export default function InfiniteList({
  items,
  renderItem,
  loadPage,
  pageSize = 8,
  components,
}) {
  const Components = {
    ...defaultComponents,
    ...components,
  };

  const [{ start, end }, setState] = useState({
    start: 0,
    end: Math.min(pageSize, items.length),
  });
  const loaderRef = useRef(null);

  const loaderIO = useMemo(
    () =>
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (end < items.length) {
              setState(({ start, end }) => ({ start, end: end + pageSize }));
            } else if (loadPage) {
              loadPage();
            }
          }
        });
      }),
    [end, items.length, pageSize, loadPage]
  );

  useEffect(() => {
    const loader = loaderRef.current;
    if (loader) {
      loaderIO.observe(loader);
      return () => loaderIO.unobserve(loader);
    }
  }, [loaderIO]);

  return (
    <Components.Container>
      {items.slice(start, end).map(renderItem)}
      {(end < items.length || loadPage) && (
        <Components.Loader ref={loaderRef} />
      )}
    </Components.Container>
  );
}
