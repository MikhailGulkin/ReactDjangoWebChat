import React from "react";
import { SendJsonMessage } from "react-use-websocket/src/lib/types";

export const _handleSubmit =
  (
    message: string,
    timeout: React.MutableRefObject<any>,
    setMessage: React.Dispatch<any>,
    timeoutFunction: Function,
    sendJsonMessage: SendJsonMessage
  ) =>
  () => {
    if (message.length === 0) return;
    if (message.length > 512) return;

    sendJsonMessage({
      type: "chat_message",
      message,
    });
    setMessage("");
    clearTimeout(timeout.current);
    timeoutFunction();
  };
