import React, { createContext, ReactNode, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

import { DefaultProps } from "@/@types/notification";
import { NotificationProps } from "@/@types/notification";

import { AuthContext } from "./AuthContext";


export const NotificationContext =
  createContext<NotificationProps>(DefaultProps);

export const NotificationContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user } = useContext(AuthContext);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { readyState } = useWebSocket(
    user ? `ws://${process.env.REACT_APP_API_SOCKET}/notifications/` : null,
    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected to Notifications!");
      },
      onClose: () => {
        console.log("Disconnected from Notifications!");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        switch (data.type) {
          case "unread_count":
            setUnreadMessageCount(data.unread_count);
            break;
          case "new_message_notification":
            setUnreadMessageCount(data.unread_count);
            break;
          case "online_user_status":
            setOnlineUsers([data.name as never, ...onlineUsers]);
            break;
          case "offline_user_status":
            setOnlineUsers(onlineUsers.filter((ele) => ele !== data.name));
            break;
          default:
            console.error("Unknown message type!");
            break;
        }
      },
    }
  );

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  return (
    <NotificationContext.Provider
      value={{ unreadMessageCount, connectionStatus, onlineUsers }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
