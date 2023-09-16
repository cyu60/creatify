"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const onSubmit = () => {
  console.log("submit");
};
const CreateMindMapButton = () => {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("name of concepify");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-goodpink">
          <Plus />{" "}
          <div className="pl-4 text-md font-bold whitespace-nowrap">
            Add a new Concepify
          </div>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create a new Conceptify</DialogTitle>
          <DialogDescription>
            A Concepify is a mind map that helps you organize your thoughts.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Label
            </Label>
            <Input
              id="name"
              value={label}
              className="col-span-3"
              onChange={(e) => {
                setLabel(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <div className="flex items-center gap-x-6">
            <Link
              href={`/mindmap/${label.replaceAll(" ", "_")}`}
              className="rounded-md text-white bg-goodpink/90 px-3.5 py-2.5 text-sm font-semibold shadow-sm hover:bg-goodpink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-pink-600"
              onClick={() => setOpen(false)}
            >
              Create
            </Link>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateMindMapButton;
