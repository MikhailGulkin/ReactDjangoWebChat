import React, { ChangeEvent, useContext, useRef, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthContext } from "@/contexts/AuthContext";
import { useParams } from "react-router";
import { Message } from "@/components/pages/Chat/Message";
import { MessageType } from "@/@types/message";
import InfiniteScroll from "react-infinite-scroll-component";
import { ChatLoader } from "@/components/pages/Chat/ChatLoader";
import { ConversationType } from "@/@types/converstation";
import { _onType, _timeoutFunction, _updateTyping } from "@/utils/Chat/typing";
import { _fetchMessages } from "@/services/Chat/getNewMessage";
import { _handleSubmit } from "@/utils/Chat/sendMessage";
import { _fetchConversation } from "@/services/Chat/getConversation";
import { webSocketSwitch } from "@/utils/Chat/webSocketSwitch";

export const Chat = () => {
  const [page, setPage] = useState(2);
  const [conversation, setConversation] = useState<ConversationType | null>(
    null
  );
  const [meTyping, setMeTyping] = useState(false);
  const timeout = useRef<any>();
  const [hasMoreMessages, setHasMoreMessages] = useState(false);
  const { conversationName } = useParams();
  const [message, setMessage] = useState("");
  const { user } = useContext(AuthContext);
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
  const timeoutFunction = () => _timeoutFunction(setMeTyping, sendJsonMessage);
  const onType = () =>
    _onType(meTyping, setMeTyping, sendJsonMessage, timeout, timeoutFunction);

  const fetchMessages = _fetchMessages(
    user,
    conversationName,
    page,
    setHasMoreMessages,
    setPage,
    setMessageHistory
  );

  const handleSubmit = _handleSubmit(
    message,
    timeout,
    setMessage,
    timeoutFunction,
    sendJsonMessage
  );
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
  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    onType();
  };
  React.useEffect(() => {
    if (connectionStatus === "Open") {
      sendJsonMessage({
        type: "read_messages",
      });
    }
  }, [connectionStatus, sendJsonMessage]);
  return (
    <div className="base-container">
      {conversation && (
        <div className="py-6">
          <h3 className="text-3xl font-semibold text-gray-900">
            Chat with user: {conversation.other_user.username}
          </h3>
          {typing && (
            <p className="truncate text-sm text-gray-500">typing...</p>
          )}
          <span className="text-sm">
            {conversation.other_user.username} is currently
            {participants.includes(conversation.other_user.username)
              ? " online"
              : " offline"}
          </span>
        </div>
      )}
      <div
        className="h-[30rem] mt-3 flex flex-col-reverse relative w-full border border-gray-200 overflow-y-auto p-6"
        id="scrollableDiv"
      >
        <InfiniteScroll
          dataLength={messageHistory.length}
          next={fetchMessages}
          inverse={true}
          className="flex flex-col-reverse"
          hasMore={hasMoreMessages}
          loader={<ChatLoader />}
          scrollableTarget="scrollableDiv"
        >
          {messageHistory.map((message: MessageType, index: number) => (
            <Message key={`${message.id} - ${index}`} message={message} />
          ))}
        </InfiniteScroll>
      </div>
      <div className="flex mt-10">
        <input
          type="text"
          name="message"
          placeholder="Message"
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
      </div>
    </div>
  );
};
