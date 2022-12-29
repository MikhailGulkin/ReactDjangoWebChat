import React from "react";
import { Github } from "@/components/ui/svg/Github";

export const Footer: React.FC = () => {
  return (
    <div className="w-full bg-gray-200 mt-20">
      <div className="flex my-2 justify-center">
        <Github />
      </div>
    </div>
  );
};
