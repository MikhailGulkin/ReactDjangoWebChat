export const formatMessageTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString().slice(0, 5);
};