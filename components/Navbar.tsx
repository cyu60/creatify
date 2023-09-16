import React from "react";
import { Button } from "./ui/button";
import { Menu, Plus } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./MobileSidebar";
import CreateMindMapButton from "./CreateMindMapButton";

const Navbar = () => {
  return (
    <div className="flex items-center pt-6 pb-4 px-4">
      <MobileSidebar />
      <div className="hidden md:inline ">
        <CreateMindMapButton />
      </div>
      <div className="flex w-full justify-end">
        <UserButton afterSignOutUrl="/"></UserButton>
      </div>
    </div>
  );
};

export default Navbar;
