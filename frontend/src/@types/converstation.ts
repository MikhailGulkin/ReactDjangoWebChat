import { UserType } from "@/@types/user";
import { MessageType } from "@/@types/message";

export interface ConversationType {
  id: string;
  // eslint-disable-next-line no-restricted-globals
  name: string;
  last_message: MessageType | null;
  other_user: UserType;
}
