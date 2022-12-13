import React, { ChangeEvent, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import InfiniteScroll from "react-infinite-scroll-component";
import { AuthContext } from "@/contexts/AuthContext";
import { useParams } from "react-router";
import { ChatLoader } from "@/components/Chat/ChatLoader";
import { Message } from "@/components/Chat/Message";
import { MessageModel } from "@/models/Message";
import { ConversationModel } from "@/models/Conversation";

export const Chat = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<any>([]);
  const [page, setPage] = useState(2);
  const [participants, setParticipants] = useState<string[]>([]);
  const [conversation, setConversation] = useState<ConversationModel | null>(
    null
  );

  const [hasMoreMessages, setHasMoreMessages] = useState(false);

  const { user } = useContext(AuthContext);
  const { conversationName } = useParams();
  const [message, setMessage] = useState("");

  const { readyState, sendJsonMessage } = useWebSocket(
    user ? `ws://127.0.0.1:8000/${conversationName}/` : null,
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
        switch (data.type) {
          case "welcome_message":
            setWelcomeMessage(data.message);
            break;
          case "greeting_response":
            setWelcomeMessage(data.message);
            break;
          case "chat_message_echo":
            setMessageHistory((prev: any) => [data.message, ...prev]);
            break;
          case "last_50_messages":
            setMessageHistory(data.messages);
            setHasMoreMessages(data.has_more);
            break;
          case "user_join":
            setParticipants((pcpts: string[]) => {
              if (!pcpts.includes(data.user)) {
                return [...pcpts, data.user];
              }
              return pcpts;
            });
            break;
          case "user_leave":
            setParticipants((pcpts: string[]) => {
              const newPcpts = pcpts.filter((x) => x !== data.user);
              return newPcpts;
            });
            break;
          case "online_user_list":
            setParticipants(data.users);
            break;
          default:
            console.error("Unknown message type!");
            break;
        }
      },
    }
  );
  async function fetchMessages() {
    const apiRes = await fetch(
      `http://127.0.0.1:8000/api/messages/?conversation=${conversationName}&page=${page}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Token ${user?.token}`,
        },
      }
    );
    if (apiRes.status === 200) {
      const data: {
        count: number;
        next: string | null; // URL
        previous: string | null; // URL
        results: MessageModel[];
      } = await apiRes.json();
      setHasMoreMessages(data.next !== null);
      setPage(page + 1);
      setMessageHistory((prev: MessageModel[]) => prev.concat(data.results));
    }
  }
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated",
  }[readyState];

  const onInputChangeMsg = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const onButtonClick = () => {
    sendJsonMessage({
      type: "chat_message",
      message,
    });
    setMessage("");
  };
  React.useEffect(() => {
    async function fetchConversation() {
      const apiRes = await fetch(
        `http://127.0.0.1:8000/api/conversations/${conversationName}/`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Token ${user?.token}`,
          },
        }
      );
      if (apiRes.status === 200) {
        const data: ConversationModel = await apiRes.json();
        setConversation(data);
      }
    }
    fetchConversation();
  }, [conversationName, user]);
  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col w-1/6">
        <input
          name="message"
          placeholder="Message"
          onChange={onInputChangeMsg}
          value={message}
          className="shadow-sm sm:text-sm border-gray-300 bg-gray-100 rounded-md mb-2"
        />
        <button className="bg-gray-300 px-3 py-1" onClick={onButtonClick}>
          Submit
        </button>
      </div>
      <div>
        <ul>
          <InfiniteScroll
            dataLength={messageHistory.length}
            next={fetchMessages}
            className="flex flex-col-reverse"
            inverse={true}
            hasMore={hasMoreMessages}
            loader={<ChatLoader />}
            scrollableTarget="scrollableDiv"
          >
            {messageHistory.map((message: any, idx: number) => (
              <div className="border border-gray-200 py-3 px-3" key={idx}>
                <Message key={message.id} message={message} />
              </div>
            ))}
          </InfiniteScroll>
        </ul>
      </div>
      <div>
        {conversation && (
          <div className="py-6">
            <h3 className="text-3xl font-semibold text-gray-900">
              Chat with user: {conversation?.other_user.username}
            </h3>
            <span className="text-sm">
              {conversation?.other_user.username} is currently
              {participants.includes(conversation.other_user.username)
                ? " online"
                : " offline"}
            </span>
          </div>
        )}
      </div>
      <div>
        <span>The WebSocket is currently {connectionStatus}</span>
        <p>{welcomeMessage}</p>
      </div>
    </div>
  );
};
