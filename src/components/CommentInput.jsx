import { api } from "utils/api";

import { useEffect, useRef, useState } from "react";

import Button from "components/ui/Button";
import Form from "components/ui/Form";
import Input from "components/ui/Input";

export default function CommentInput({ routeId, onSubmit }) {
  const inputRef = useRef();
  useEffect(() => {
    if (window.location.hash === "#comment") {
      inputRef.current.focus();
    }
  }, []);
  const [text, setText] = useState("");

  return (
    <Form
      className="flex p-2 space-x-2"
      onSubmit={async (event) => {
        event.preventDefault();
        await api.post("comment", { body: { route_id: routeId, text } });
        setText("");
        if (typeof onSubmit === "function") {
          onSubmit();
        }
      }}
    >
      <Input
        ref={inputRef}
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder="Add a comment..."
        className="flex-grow bg-gray-50"
      />
      <Button
        className="rounded-md px-4 py-2 text-white font-bold"
        bgColor="blue"
        disabled={!text}
      >
        Post
      </Button>
    </Form>
  );
}
