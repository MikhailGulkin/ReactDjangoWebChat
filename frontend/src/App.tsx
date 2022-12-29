import React from "react";
import { Route, Routes } from "react-router";
import { paths } from "@/routing/config";
import { RoutesList } from "@/routing/paths";
import { MainLayout } from "@/layouts/MaynLayouts";
import { AuthContextProvider } from "@/contexts/AuthContext";
import { NotificationContextProvider } from "@/contexts/NotificationContext";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route
        path={paths.main}
        element={
          <AuthContextProvider>
            <NotificationContextProvider>
              <MainLayout />
            </NotificationContextProvider>
          </AuthContextProvider>
        }
      >
        {RoutesList.map((obj, index) => (
          <Route key={index} {...obj} />
        ))}
      </Route>
    </Routes>
  );
};
