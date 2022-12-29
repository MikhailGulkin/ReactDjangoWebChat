import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@/contexts/AuthContext";
import { ConversationType } from "@/@types/converstation";
import { paths } from "@/routing/config";

export function ActiveConversations() {
  const { user } = useContext(AuthContext);
  const [conversations, setActiveConversations] = useState<ConversationType[]>(
    []
  );

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(`http://${process.env.REACT_APP_API_SOCKET}/api/conversations/`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();
      setActiveConversations(data);
    }

    fetchUsers();
  }, [user]);

  function createConversationName(username: string) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  function formatMessageTimestamp(timestamp?: string) {
    if (!timestamp) return;
    const date = new Date(timestamp);
    return date.toLocaleTimeString().slice(0, 5);
  }

  return (
    <div className="base-container">
      {conversations.map((c) => (
        <Link
          to={`${paths.chat(createConversationName(c.other_user.username))}`}
          key={c.other_user.username}
        >
          <div className="border border-gray-200 w-full p-3 mb-2">
            <h3 className="text-xl font-semibold text-gray-800">
              {c.other_user.username}
            </h3>
            <div className="flex justify-between">
              <p className="text-gray-700">{c.last_message?.content}</p>
              <p className="text-gray-700">
                {formatMessageTimestamp(c.last_message?.timestamp)}
              </p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
