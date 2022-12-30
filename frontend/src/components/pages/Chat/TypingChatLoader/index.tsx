import React from "react";
import style from "./TypingChatLoader.module.scss";

export const TypingChatLoader = () => {
  return (
    <div
      className={`bg-white flex space-x-2 rounded-full justify-center items-center`}
    >
      <div
        className={`bg-gray-400  w-2 h-2 rounded-full ${style.bounce} ${style.firstCircle}`}
      ></div>
      <div
        className={`bg-gray-500 w-2 h-2 rounded-full ${style.bounce} ${style.secondCircle}`}
      ></div>
      <div
        className={`bg-gray-600 w-2 h-2 rounded-full ${style.bounce} ${style.thirdCircle}`}
      ></div>
    </div>
  );
};
