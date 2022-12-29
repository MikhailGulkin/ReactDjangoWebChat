import { onMessageHandlerType } from "@/@types/socket";
import React from "react";
import {SendJsonMessage} from "react-use-websocket/src/lib/types";

export const webSocketSwitch = (
  data: any,
  setMessageHistory: React.Dispatch<any>,
  setHasMoreMessages: React.Dispatch<any>,
  setParticipants: React.Dispatch<any>,
  sendJsonMessage: SendJsonMessage,
  updateTyping: Function
) => {
  switch (data.type) {
    case onMessageHandlerType.chat_message_echo:
      setMessageHistory((prev: any) => [data.message, ...prev]);
      sendJsonMessage({type: 'read_messages'})
      break;
    case onMessageHandlerType.last_50_messages:
      setMessageHistory(data.messages);
      setHasMoreMessages(data.has_more);
      break;
    case onMessageHandlerType.user_join:
      setParticipants((pcpts: string[]) => {
        if (!pcpts.includes(data.user)) {
          return [...pcpts, data.user];
        }
        return pcpts;
      });
      break;
    case onMessageHandlerType.user_leave:
      setParticipants((pcpts: string[]) => {
        return pcpts.filter((x) => x !== data.user);
      });
      break;
    case onMessageHandlerType.online_user_list:
      setParticipants(data.users);
      break;
    case onMessageHandlerType.typing:
      updateTyping(data);
      break;
    default:
      console.error("Unknown message type");
      break;
  }
};
