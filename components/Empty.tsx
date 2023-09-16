import React from "react";
import Image from "next/image";

interface EmptyProps {
  label: string;
}
const Empty = ({ label }: EmptyProps) => {
  return (
    <div className="h-full flex flex-col items-center justify-center space-y-5 py-12">
      {/* Empty */}
      <div className="w-96 h-48 relative">
        <Image alt="Empty" src="/questions.jpg" fill />
      </div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
};

export default Empty;
