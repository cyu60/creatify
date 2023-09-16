import { cn } from "@/lib/utils";
import { IconNode, LucideIcon } from "lucide-react";
import React from "react";

interface HeaderProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconColor?: string;
  bgColor?: string;
}
const Header = ({
  title,
  description,
  icon: Icon,
  iconColor,
  bgColor,
}: HeaderProps) => {
  return (
    <div>
      <div className="pl-4 flex flex-row items-center gap-x-4 pb-5">
        {/* Create a background circle */}
        <div className={cn("p-2 rounded-md w-fit", bgColor)}>
          {/* Add in the icon */}
          <Icon className={`h-8 w-8 ${iconColor}`} />
        </div>
        <div className="flex flex-col">
          <h1 className="font-semibold text-3xl">{title}</h1>
          <h2 className="text-muted-foreground font-light text-md">{description}</h2>
        </div>
      </div>
    </div>
  );
};

export default Header;
