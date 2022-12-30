import { UserType } from "@/@types/user";

export const createConversationName = (username: string, user: UserType | null) => {
  const namesAlph = [user?.username, username].sort();
  return `${namesAlph[0]}__${namesAlph[1]}`;
};