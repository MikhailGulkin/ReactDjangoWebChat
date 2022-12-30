import { SendJsonMessage } from "react-use-websocket/src/lib/types";
import React from "react";
import { ConversationType } from "@/@types/converstation";
import { Params } from "react-router-dom";

export interface ChatBottomType {
  sendJsonMessage: SendJsonMessage;
  timeout: React.MutableRefObject<any>;
}

export interface ChatHeaderType {
  conversation: ConversationType | null;
  participants: string[];
}

export interface ChatBodyType {
  setHasMoreMessages: React.Dispatch<React.SetStateAction<boolean>>;
  setMessageHistory: React.Dispatch<any>;
  conversationName: string | undefined;
  messageHistory: any;
  hasMoreMessages: boolean;
  typing: boolean;
  conversation: ConversationType | null;
}
