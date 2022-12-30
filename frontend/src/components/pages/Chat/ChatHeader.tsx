import React from "react";
import { ChatHeaderType } from "@/@types/chat";

export const ChatHeader: React.FC<ChatHeaderType> = ({
  conversation,
  participants,
}) => {
  return (
    <>
      {conversation && (
        <div className="py-6">
          <div className="flex items-center ">
            <h3 className="text-3xl font-semibold text-gray-900 mr-2">
              Chat with user: {conversation.other_user.username}
            </h3>
            {participants.includes(conversation.other_user.username) ? (
              <div className="ring-black ring-1 bg-green-500 w-5 h-5 rounded-full"></div>
            ) : (
              <div className="ring-black ring-1 bg-red-500 w-5 h-5 rounded-full"></div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
