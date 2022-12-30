import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { ConversationType } from "@/@types/converstation";
import { paths } from "@/routing/config";
import { NotificationContext } from "@/contexts/NotificationContext";
import { formatMessageTimestamp } from "@/utils/formatMessage";
import { createConversationName } from "@/utils/createConversationName";

export function ActiveConversations() {
  const { user } = useContext(AuthContext);
  const { unreadMessageCount, onlineUsers } = useContext(NotificationContext);
  const [conversations, setActiveConversations] = useState<ConversationType[]>(
    []
  );
  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(
        `http://${process.env.REACT_APP_API_SOCKET}/api/conversations/`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await res.json();
      setActiveConversations(data);
    }

    fetchUsers();
  }, [user, unreadMessageCount, onlineUsers]);

  return (
    <div className="base-container">
      {conversations.map((c) => (
        <Link
          to={`${paths.chat(
            createConversationName(c.other_user.username, user)
          )}`}
          key={c.other_user.username}
        >
          <div className="border border-gray-200 w-full p-3 mb-2">
            <div className="flex items-center">
              <h3 className="text-xl font-semibold text-gray-800 mr-2">
                {c.other_user.username}
              </h3>
              {onlineUsers.includes(c.other_user.username) ? (
                <div className="ring-black ring-1 bg-green-500 w-3 h-3 rounded-full"></div>
              ) : (
                <div className="ring-black ring-1 bg-red-500 w-3 h-3 rounded-full"></div>
              )}
            </div>
            {c.have_message && <h3>New message</h3>}
            <div className="flex justify-between">
              {c.last_message?.content && (
                <p className="text-gray-700">{c.last_message.content}</p>
              )}
              {c.last_message?.timestamp && (
                <p className="text-gray-700">
                  {formatMessageTimestamp(c.last_message?.timestamp)}
                </p>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
