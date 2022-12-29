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
      `http://127.0.0.1:8000/api/conversations/${conversationName}/`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
      }
    );
    if (apiRes.status === 200) {
      const data: ConversationType = await apiRes.json();
      setConversation(data);
    }
  };
