import { Header } from "@/components/common/Header";
import { Outlet } from "react-router-dom";
import { Footer } from "@/components/common/Footer";

export const MainLayout = () => {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="mb-auto mt-20">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
