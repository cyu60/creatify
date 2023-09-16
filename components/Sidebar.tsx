"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

import React, { useEffect, useState } from "react";
import {
  AtomIcon,
  Code,
  ImageIcon,
  LayoutDashboard,
  Lightbulb,
  MessageSquare,
  MusicIcon,
  SettingsIcon,
  VideoIcon,
  ScrollText,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/constants";
import { Button } from "./ui/button";
import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
// const routes = [
//   {
//     label: "Dashboard",
//     icon: LayoutDashboard,
//     href: "/dashboard",
//     color: "text-sky-500",
//   },

//   {
//     label: "Ideation",
//     icon: Lightbulb,
//     href: "/ideation",
//     color: "text-yellow-500",
//   },

//   {
//     label: "Research Generation",
//     icon: ScrollText,
//     href: "/research",
//     color: "text-purple-500",
//   },

//   {
//     label: "Image Generation",
//     icon: ImageIcon,
//     href: "/image",
//     color: "text-pink-500",
//   },

//   {
//     label: "Video Generation",
//     icon: VideoIcon,
//     href: "/video",
//     color: "text-orange-500",
//   },

//   {
//     label: "Music Generation",
//     icon: MusicIcon,
//     href: "/music",
//     color: "text-emerald-500",
//   },
//   {
//     label: "Code Generation",
//     icon: Code,
//     href: "/code",
//     color: "text-green-500",
//   },
//   {
//     label: "Settings",
//     icon: SettingsIcon,
//     href: "/settings",
//     // color: "text-emerald-500",
//   },
// ];

interface SidebarButtonProps {
  label: string;
}

const SidebarButton = ({ label }: SidebarButtonProps) => {
  return (
    <Button
      className={cn(
        "text-sm flex p-6 w-full justify-start font-medium cursor-pointer bg-transparent hover:bg-white/10 rounded-none transition group"
      )}
      onClick={() => toast("Feature COMING SOON...")}
    >
      <div className="flex items-center flex-1 space-x-1 font-bold text-md">
        {label}
      </div>
    </Button>
  );
};

const Sidebar = () => {
  // const router = useRouter();
  // // Fix hydration error
  // const [isMounted, setIsMounted] = useState(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);
  // if (!isMounted) {
  //   return null;
  // }
  const pathname = usePathname();
  return (
    <div className="py-4 flex flex-col h-full bg-goodpink text-white">
      <ToastContainer></ToastContainer>
      <div className="py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-6 pr-3 mb-10">
          <div className="relative w-8 h-8 mr-4">
            <Image fill alt="Logo" src="/circle_brain_logo.png"></Image>
          </div>
          <h1 className="text-2xl font-bold text-white">Concepify</h1>
        </Link>
        <div className="space-y-1">
          <SidebarButton label="Recent" />
          <SidebarButton label="Created by you" />
          <SidebarButton label="Shared with you" />
          <div className="relative mx-3">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <div
            className={cn(
              "text-sm flex p-6 w-full justify-start font-medium bg-transparent rounded-none transition group"
            )}
          >
            <div className="flex items-center flex-1 space-x-1 font-bold text-md">
              Projects
            </div>
          </div>
          {/* {routes.map((route) => (
            <Link
              className={cn(
                "text-sm flex p-3 w-full justify-start font-medium cursor-pointer hover:bg-white/10 rounded-lg transition group",
                pathname === route.href ? "bg-white/10" : "text-gray-400"
              )}
              href={route.href}
              key={route.href}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))} */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
