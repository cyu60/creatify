import {
  AtomIcon,
  Code,
  CodeIcon,
  CogIcon,
  ImageIcon,
  LayoutDashboard,
  LayoutDashboardIcon,
  Lightbulb,
  LightbulbIcon,
  MessageSquare,
  MusicIcon,
  SettingsIcon,
  VideoIcon,
  ScrollText,
} from "lucide-react";

export const ideation = {
  label: "Ideation",
  icon: LightbulbIcon,
  description: "Ideate your next hackathon idea",
  href: "/ideation",
  color: "text-yellow-500",
  bgColor: "bg-yellow-500/10",
};

export const dashboard = {
  label: "Dashboard",
  icon: LayoutDashboardIcon,
  description: "Your dashboard for managing everything",
  href: "/dashboard",
  color: "text-sky-500",
  bgColor: "bg-sky-500/10",
};

export const researchGeneration = {
  label: "Research",
  icon: ScrollText,
  description: "Aggregate research to implement your idea",
  href: "/research",
  color: "text-purple-500",
  bgColor: "bg-purple-500/10",
};

export const imageGeneration = {
  label: "Image Generation",
  icon: ImageIcon,
  description: "Generate amazing images with AI",
  href: "/image",
  color: "text-pink-500",
  bgColor: "bg-pink-500/10",
};

export const videoGeneration = {
  label: "Video Generation",
  icon: VideoIcon,
  description: "Create AI-powered videos in minutes",
  href: "/video",
  color: "text-orange-500",
  bgColor: "bg-orange-500/10",
};

export const musicGeneration = {
  label: "Music Generation",
  icon: MusicIcon,
  description: "Compose unique soundtracks with AI",
  href: "/music",
  color: "text-emerald-500",
  bgColor: "bg-emerald-500/10",
};

export const codeGeneration = {
  label: "Code Generation",
  icon: CodeIcon,
  description: "AI-generated code for your projects",
  href: "/code",
  color: "text-green-500",
  bgColor: "bg-green-500/10",
};

export const settings = {
  label: "Settings",
  icon: CogIcon,
  description: "Configure your app settings",
  href: "/settings",
  color: "text-white-500",
};

export const routes = [
  dashboard,
  ideation,
  researchGeneration,
  imageGeneration,
  videoGeneration,
  musicGeneration,
  codeGeneration,
  settings,
];
