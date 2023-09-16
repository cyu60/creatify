'use client';
import { Menu } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import Sidebar from './Sidebar';

const MobileSidebar = () => {
  // Fix hydration error
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return !isMounted ? null : (
    <>
      {/* Sheet is drawer from Shadcn */}
      <Sheet>
        <SheetTrigger className='md:hidden'>
          {/* Use "md" in classname to hid in larger screens */}
          {/* DON'T UNCOMMENT THIS BUTTON, SHEET TRIGGER IS A BUTTON SO YOU GET A BUTTON INSIDE A BUTTON warning. */}
          {/* <Button variant={"ghost"} size={"icon"} className="md:hidden"> */}
          <Menu></Menu>
          {/* </Button> */}
        </SheetTrigger>
        <SheetContent side='left' className='p-0'>
          <Sidebar></Sidebar>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default MobileSidebar;
