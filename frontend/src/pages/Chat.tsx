import React, { ChangeEvent, useContext, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { AuthContext } from "@/contexts/AuthContext";
import { useParams } from "react-router";
import { Message } from "@/components/Chat/Message";

export const Chat = () => {
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [messageHistory, setMessageHistory] = useState<any>([]);
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
            setMessageHistory((prev: any) => prev.concat(data.message));
            break;
          case "last_50_messages":
            setMessageHistory(data.messages);
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
          {messageHistory.map((message: any, idx: number) => (
            <div className="border border-gray-200 py-3 px-3" key={idx}>
              <Message key={message.id} message={message}/>
            </div>
          ))}
        </ul>
      </div>
      <div>
        <span>The WebSocket is currently {connectionStatus}</span>
        <p>{welcomeMessage}</p>
      </div>
    </div>
  );
};
