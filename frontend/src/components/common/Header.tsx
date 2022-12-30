import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { paths } from "@/routing/config";
import { AuthContext } from "@/contexts/AuthContext";
import { NotificationContext } from "@/contexts/NotificationContext";

export const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const { unreadMessageCount } = useContext(NotificationContext);
  return (
    <>
      <nav className="bg-white border-gray-200 px-4 sm:px-6 py-2.5 rounded dark:bg-gray-800">
        <div className="base-container flex flex-wrap justify-between items-center">
          <Link to={paths.main} className="flex items-center">
            <span className="self-center text-xl font-semibold whitespace-nowrap dark:text-white">
              React-Django Chat
            </span>
          </Link>
          <div className=" w-auto">
            <ul className="flex mt-4 flex-row space-x-8 mt-0 text-sm font-medium">
              <li>
                <Link to={paths.main} className="py-2 pr-4 pl-3 text-black p-0">
                  Chats
                </Link>
              </li>
              <li>
                <Link
                  to={paths.conversations}
                  className="py-2 pr-4 pl-3 text-black p-0"
                >
                  Active Conversations
                </Link>
              </li>
              {unreadMessageCount > 0 && (
                <li>
                  <span className="py-2 pr-4 pl-3 text-black p-0">
                    New message: {unreadMessageCount}
                  </span>
                </li>
              )}
              {user ? (
                <>
                  <li>
                    <span className="text-black">
                      Logged in: {user.username}
                    </span>
                  </li>
                  <li>
                    <button className="text-black" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to={paths.login}
                    className="py-2 pr-4 pl-3 text-black p-0"
                  >
                    Login
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};
