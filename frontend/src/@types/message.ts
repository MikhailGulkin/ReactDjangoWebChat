import { UserType } from "./user";

export interface MessageType {
  id: string;
  room: string;
  from_user: UserType;
  to_user: UserType;
  content: string;
  timestamp: string;
  read: boolean;
}