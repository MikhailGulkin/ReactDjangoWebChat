import { Chat } from "@/pages/Chat";
import { Login } from "@/pages/Auth/Login";
import { paths } from "@/routing/config";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { Home } from "@/pages/Home";
import { ActiveConversations } from "@/pages/ActiveConverstation";

export const RoutesList = [
  {
    index: true,
    element: (
      <ProtectedRoute>
        <Home />
      </ProtectedRoute>
    ),
  },
  {
    path: paths.chat(":conversationName"),
    element: (
      <ProtectedRoute>
        <Chat />
      </ProtectedRoute>
    ),
  },
  {
    path: paths.conversations,
    element: (
      <ProtectedRoute>
        <ActiveConversations />
      </ProtectedRoute>
    ),
  },
  { path: paths.login, element: <Login /> },
];

