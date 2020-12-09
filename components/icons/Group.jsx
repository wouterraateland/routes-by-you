import React from "react";
import Icon from "./Icon";

const Group = ({ style, ...props }) => (
  <Icon viewBox="0 0 32 32" {...props}>
    <path
      d="M16.25 18.625C18.5 19.375 20 20.79 20 25H2c0-4.229 1.5-5.625 3.75-6.375C7.625 20.125 9.229 20.5 11 20.5c1.79 0 3.375-.375 5.25-1.875zm10 0C28.5 19.375 30 20.79 30 25h-5.5c0-1.74-.299-3.45-.808-4.91.822-.283 1.657-.744 2.558-1.465zM11 7a4.5 4.5 0 110 9 4.5 4.5 0 010-9zm10 0a4.5 4.5 0 11-2.013 8.526A8.458 8.458 0 0020 11.5a8.462 8.462 0 00-1.012-4.025A4.465 4.465 0 0121 7z"
      fill={style === "filled" ? undefined : "none"}
    />
  </Icon>
);

export default Group;
