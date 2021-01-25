import { useRef } from "react";

import Check from "components/icons/Check";
import ToolTip from "components/ui/ToolTip";

export default function Username({ user }) {
  const originRef = useRef();
  return user.verified ? (
    <>
      {user.display_name}{" "}
      <span
        ref={originRef}
        className="inline-flex rounded-full bg-blue-600 text-white"
      >
        <Check style={{ height: "0.75em", margin: "0.125em" }} />
      </span>
      <ToolTip originRef={originRef}>Verified routesetter</ToolTip>
    </>
  ) : (
    user.display_name
  );
}
