import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { UserResponseType } from "@/@types/user";
import { AuthContext } from "@/contexts/AuthContext";
import { paths } from "@/routing/config";

export const Home = () => {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState<UserResponseType[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch(
        `http://${process.env.REACT_APP_API_SOCKET}/api/users/all`,
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await res.json();
      setUsers(data);
    }

    fetchUsers();
  }, [user]);

  function createConversationName(username: string) {
    const namesAlph = [user?.username, username].sort();
    return `${namesAlph[0]}__${namesAlph[1]}`;
  }

  return (
    users && (
      <div className="base-container">
        {users
          .filter((u: UserResponseType) => u.username !== user?.username)
          .map((u: UserResponseType, index) => (
            <Link
              key={`${u.username} - ${index}`}
              to={`${paths.chat(createConversationName(u.username))}`}
            >
              <div className="border border-gray-200 w-full p-3 mb-2">
                {u.username}
              </div>
            </Link>
          ))}
      </div>
    )
  );
};
