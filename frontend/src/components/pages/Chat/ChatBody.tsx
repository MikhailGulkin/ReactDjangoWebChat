import React, { useContext, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { ChatLoader } from "@/components/pages/Chat/ChatLoader";
import { TypingChatLoader } from "@/components/pages/Chat/TypingChatLoader";
import { MessageType } from "@/@types/message";
import { Message } from "@/components/pages/Chat/Message";
import { _fetchMessages } from "@/services/Chat/getNewMessage";
import { AuthContext } from "@/contexts/AuthContext";
import { ChatBodyType } from "@/@types/chat";

export const ChatBody: React.FC<ChatBodyType> = ({
  conversationName,
  setMessageHistory,
  setHasMoreMessages,
  conversation,
  typing,
  messageHistory,
  hasMoreMessages,
}) => {
  const [page, setPage] = useState(2);
  const { user } = useContext(AuthContext);

  const fetchMessages = _fetchMessages(
    user,
    conversationName,
    page,
    setHasMoreMessages,
    setPage,
    setMessageHistory
  );
  return (
    <div
      className="h-[30rem] mt-3 flex flex-col-reverse relative w-full border border-gray-200 overflow-y-auto p-6"
      id="scrollableDiv"
    >
      <InfiniteScroll
        dataLength={messageHistory.length}
        next={fetchMessages}
        style={{ overflowY: "hidden" }}
        inverse={true}
        className="flex flex-col-reverse"
        hasMore={hasMoreMessages}
        loader={<ChatLoader />}
        scrollableTarget="scrollableDiv"
      >
        {typing && (
          <div className="flex mt-8">
            <p className="truncate text-sm text-gray-800 mr-2">
              {conversation?.other_user.username} typing
            </p>
            <div className="mt-3">
              <TypingChatLoader />
            </div>
          </div>
        )}
        {messageHistory.map((message: MessageType, index: number) => (
          <Message key={`${message.id} - ${index}`} message={message} />
        ))}
      </InfiniteScroll>
    </div>
  );
};
