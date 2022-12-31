import React from "react";
import { SendJsonMessage } from "react-use-websocket/src/lib/types";
import { UserType } from "@/@types/user";

export const _updateTyping =
  (setTyping: React.Dispatch<any>, user: UserType | null) =>
  (event: { user: string; typing: boolean }) => {
    if (event.user !== user!.username) {
      setTyping(event.typing);
    }
  };
export const _timeoutFunction = (
  setMeTyping: React.Dispatch<any>,
  sendJsonMessage: SendJsonMessage
) => {
  setMeTyping(false);
  sendJsonMessage({ type: "typing", typing: false });
};

export const _onType = (
  meTyping: boolean,
  setMeTyping: React.Dispatch<any>,
  sendJsonMessage: SendJsonMessage,
  timeout: React.MutableRefObject<any>,
  timeoutFunction: Function
) => {
  if (!meTyping) {
    setMeTyping(true);
    sendJsonMessage({ type: "typing", typing: true });
    timeout.current = setTimeout(timeoutFunction, 5000);
  } else {
    clearTimeout(timeout.current);
    timeout.current = setTimeout(timeoutFunction, 5000);
  }
};
