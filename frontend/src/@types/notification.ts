export const DefaultProps = {
  unreadMessageCount: 0,
  connectionStatus: "Uninstantiated",
  onlineUsers: [],
};

export interface NotificationProps {
  unreadMessageCount: number;
  connectionStatus: string;
  onlineUsers: string[];
}