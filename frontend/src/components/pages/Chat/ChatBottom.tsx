import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { _handleSubmit } from "@/utils/Chat/sendMessage";
import { _onType, _timeoutFunction } from "@/utils/Chat/typing";
import { ChatBottomType } from "@/@types/chat";

export const ChatBottom: React.FC<ChatBottomType> = ({
  sendJsonMessage,
  timeout,
}) => {
  const [meTyping, setMeTyping] = useState(false);
  const [message, setMessage] = useState("");

  const timeoutFunction = () => _timeoutFunction(setMeTyping, sendJsonMessage);

  const onType = () =>
    _onType(meTyping, setMeTyping, sendJsonMessage, timeout, timeoutFunction);

  const handleSubmit = _handleSubmit(
    message,
    timeout,
    setMessage,
    timeoutFunction,
    sendJsonMessage
  );
  const onInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    onType();
  };
  return (
    <>
      <input
        type="text"
        name="message"
        placeholder="Message"
        onKeyDown={onInputKeyDown}
        onChange={onInputChange}
        value={message}
        className="base-input"
        maxLength={511}
      />
      <button
        disabled={!message}
        className="disabled:opacity-80 disabled:pointer-events-none ml-4 base-button"
        onClick={handleSubmit}
      >
        Submit
      </button>
    </>
  );
};
