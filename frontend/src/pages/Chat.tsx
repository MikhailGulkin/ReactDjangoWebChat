import React, { useContext, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useParams } from "react-router";

import { ConversationType } from "@/@types/converstation";

import { AuthContext } from "@/contexts/AuthContext";
import { webSocketSwitch } from "@/utils/Chat/webSocketSwitch";
import { _updateTyping } from "@/utils/Chat/typing";

import { _fetchConversation } from "@/services/Chat/getConversation";
import { ChatBottom } from "@/components/pages/Chat/ChatBottom";
import { ChatHeader } from "@/components/pages/Chat/ChatHeader";
import { ChatBody } from "@/components/pages/Chat/ChatBody";

export const Chat = () => {
  const { user } = useContext(AuthContext);
  const { conversationName } = useParams();
  const [conversation, setConversation] = useState<ConversationType | null>(
    null
  );
  const timeout = useRef<any>();
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [participants, setParticipants] = useState<string[]>([]);
  const [typing, setTyping] = useState(false);

  const { readyState, sendJsonMessage } = useWebSocket(
    user
      ? `ws://${process.env.REACT_APP_API_SOCKET}/chats/${conversationName}/`
      : null,

    {
      queryParams: {
        token: user ? user.token : "",
      },
      onOpen: () => {
        console.log("Connected!");
      },
      onClose: () => {
        console.log("Disconnected!");
      },
      onMessage: (e) => {
        const data = JSON.parse(e.data);
        webSocketSwitch(
          data,
          setMessageHistory,
          setHasMoreMessages,
          setParticipants,
          sendJsonMessage,
          updateTyping
        );
      },
    }
  );

  const updateTyping = _updateTyping(setTyping, user);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  React.useEffect(() => () => clearTimeout(timeout.current), []);
  React.useEffect(() => {
    const fetchConversation = _fetchConversation(
      conversationName,
      user,
      setConversation
    );

    fetchConversation();
  }, [conversationName, user]);

  React.useEffect(() => {
    if (connectionStatus === "Open") {
      sendJsonMessage({
        type: "read_messages",
      });
    }
  }, [connectionStatus, sendJsonMessage]);

  return (
    <div className="base-container">
      <ChatHeader conversation={conversation} participants={participants} />
      <ChatBody
        conversationName={conversationName}
        conversation={conversation}
        messageHistory={messageHistory}
        hasMoreMessages={hasMoreMessages}
        setHasMoreMessages={setHasMoreMessages}
        setMessageHistory={setMessageHistory}
        typing={typing}
      />
      <div className="flex mt-10">
        <ChatBottom sendJsonMessage={sendJsonMessage} timeout={timeout} />
      </div>
    </div>
  );
};
