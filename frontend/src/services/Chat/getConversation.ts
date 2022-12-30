import { ConversationType } from "@/@types/converstation";
import { UserType } from "@/@types/user";
import React from "react";

export const _fetchConversation =
  (
    conversationName: string | undefined,
    user: UserType | null,
    setConversation: React.Dispatch<any>
  ) =>
  async () => {
    const apiRes = await fetch(
      `http://${process.env.REACT_APP_API_SOCKET}/api/conversations/${conversationName}/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    if (apiRes.status === 404) {
      _fetchConversation(conversationName, user, setConversation)();
    }
    if (apiRes.status === 200) {
      const data: ConversationType = await apiRes.json();
      setConversation(data);
    }
  };
