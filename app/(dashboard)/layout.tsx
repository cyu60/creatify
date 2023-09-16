"use client";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import React from "react";
import { ReactFlowProvider } from "reactflow";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return <ReactFlowProvider>{children}</ReactFlowProvider>;
};

export default DashboardLayout;
