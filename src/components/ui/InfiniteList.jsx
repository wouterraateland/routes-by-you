import React, { forwardRef, useEffect, useMemo, useRef } from "react";

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

  const loaderRef = useRef(null);

  const loaderIO = useMemo(
    () =>
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (loadPage) {
              loadPage();
            }
          }
        });
      }),
    [items.length, pageSize, loadPage]
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
      {items.map(renderItem)}
      {loadPage && <Components.Loader ref={loaderRef} />}
    </Components.Container>
  );
}
