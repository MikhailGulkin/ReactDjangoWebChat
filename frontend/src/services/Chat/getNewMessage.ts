import React from "react";
import { MessageType } from "@/@types/message";
import { UserType } from "@/@types/user";

export const _fetchMessages =
  (
    user: UserType | null,
    conversationName: string | undefined,
    page: number,
    setHasMoreMessages: React.Dispatch<any>,
    setPage: React.Dispatch<any>,
    setMessageHistory: React.Dispatch<any>
  ) =>
  async () => {
    const apiRes = await fetch(
      `http://${process.env.REACT_APP_API_SOCKET}/api/messages/?conversation=${conversationName}&page=${page}`,
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
      const data: {
        count: number;
        next: string | null; // URL
        previous: string | null; // URL
        results: MessageType[];
      } = await apiRes.json();
      setHasMoreMessages(data.next !== null);
      setPage(page + 1);
      setMessageHistory((prev: MessageType[]) => prev.concat(data.results));
    }
  };
