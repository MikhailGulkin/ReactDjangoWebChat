import React from "react";
import { Routes, Route } from "react-router-dom";
import { Chat } from "@/pages/Chat";
import { Login } from "@/pages/Login";
import { Navbar } from "@/components/common/Navbar";
import { AuthContextProvider } from "./contexts/AuthContext";

import "./baseStyle/tailwind.scss";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { Conversations } from "@/pages/Conversations";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <AuthContextProvider>
            <Navbar />
          </AuthContextProvider>
        }
      >
        <Route index element={<Conversations />} />

        <Route
          path="chats/:conversationName"
          element={
            <ProtectedRoute>
              <Chat />
            </ProtectedRoute>
          }
        />
        <Route path="login" element={<Login />} />
      </Route>
    </Routes>
  );
};
