import React from "react";
import Image from "next/image";
import { AtomIcon } from "lucide-react";

// interface LoaderProps {
//   label: string;
// }
const Loader = () => {
  return (
    <div>
      <div className="p-8 my-4 rounded-lg w-full flex items-center justify-center bg-muted">
        <div className="h-full flex flex-col gap-y-4 items-center justify-center">
          <div className="w-10 h-10 relative">
            {/* <div className="w-10 h-10 relative animate-spin"> */}
            <AtomIcon />
            {/* <Image
          alt="Logo"
          src="/logo.png"
          fill
        /> */}
          </div>
          <p className="text-sm text-muted-foreground animate-bounce">
            Creatify is loading...
          </p>
        </div>
        {/* <div className="my-5 p-10 w-full bg-slate-200 h-10 rounded-lg">
        <div className="animate-bounce text-3xl text-center italic">Loading...</div>
      </div> */}
      </div>
    </div>
  );
};

export default Loader;
