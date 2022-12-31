import { Chat } from "@/pages/Chat";
import { Login } from "@/pages/Auth/Login";
import { Home } from "@/pages/Home";
import { ProtectedRoute } from "@/components/common/ProtectedRoute";
import { ActiveConversations } from "@/pages/ActiveConverstation";
import { paths } from "@/routing/config";

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

