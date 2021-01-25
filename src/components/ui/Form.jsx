import { useState } from "react";

export default function Form({ onSubmit, className, children, ...props }) {
  const [pending, setPending] = useState(false);

  return (
    <form
      {...props}
      onSubmit={async (event) => {
        if (pending) {
          event.preventDefault();
        } else {
          setPending(true);
          await onSubmit(event);
          setPending(false);
        }
      }}
    >
      <fieldset disabled={pending} className={className}>
        {children}
      </fieldset>
    </form>
  );
}
