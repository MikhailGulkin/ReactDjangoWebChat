import { useContext } from "react";

import { AuthContext } from "@/contexts/AuthContext";
import { MessageType } from "@/@types/message";
import { formatMessageTimestamp } from "@/utils/formatMessage";

export const Message = ({ message }: { message: MessageType }) => {
  const { user } = useContext(AuthContext);

  return (
    <li
      className={`mt-1 mb-1 flex
        ${
          user!.username === message.to_user.username
            ? "justify-start"
            : "justify-end"
        }`}
    >
      <div
        className={`relative max-w-xl rounded-lg px-2 py-1 text-gray-700 shadow
          ${user!.username === message.to_user.username ? "" : "bg-gray-100"}`}
      >
        <div className="flex items-end">
          <span className="block">{message.content}</span>
          <span
            className="ml-2"
            style={{
              fontSize: "0.6rem",
              lineHeight: "1rem",
            }}
          >
            {formatMessageTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    </li>
  );
};
