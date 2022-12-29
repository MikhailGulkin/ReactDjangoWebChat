export const paths = {
  main: "/",
  login: "login/",
  conversations: 'conversations/',
  chat: (uid: string) => `/conversations/chats/${uid}/`,
  any: "*",
};