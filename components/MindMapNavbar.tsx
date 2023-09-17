import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";
import {
  FlaskConical,
  Menu,
  Paperclip,
  PencilLine,
  Plus,
  ScrollText,
  Users,
} from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import MobileSidebar from "./MobileSidebar";
import CreateMindMapButton from "./CreateMindMapButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MindmapProps } from "@/app/(dashboard)/(routes)/dashboard/page";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { useStoreApi } from "reactflow";
import { stat } from "fs";
import { ChatCompletionRequestMessage } from "openai";
import ReactMarkdown from "react-markdown";

const SettingsButton = () => {
  const [toggle, setToggle] = useState(true);

  return (
    <Dialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="shadow-md bg-white text-primary hover:bg-goodpink hover:text-white mx-2">
            Settings
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <DialogTrigger onClick={() => setToggle(true)}>
              # of nodes
            </DialogTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DialogTrigger onClick={() => setToggle(false)}>
              Creativity level
            </DialogTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      {toggle ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      ) : (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure absolutely sure? 2</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
};

const WritingButton: React.FC = () => {
  type Mode = "summary" | "essay";
  const [mode, setMode] = useState<Mode>("summary");
  const [summary, setSummary] = useState("");
  const [essay, setEssay] = useState("");
  const [loading, setLoading] = useState(false);
  const store = useStoreApi();
  // TODO:
  // // Should load in nodeInternals on the fly? Generate button?
  // Need to make call to backend API
  // Need to have the front end updated better

  // useEffect(() => {
  // }, [mode]);

  const generateFromMindMap = async () => {
    setLoading(true);
    // logic to add child
    const { nodeInternals } = store.getState();
    const nodeData: string[] = [];

    nodeInternals.forEach(({ id, data, parentNode }) => {
      const label = data?.label || "N/A";
      const parent = parentNode || "N/A";
      const filteredNode = { id, label, parent };
      nodeData.push(JSON.stringify(filteredNode));
    });

    const systemPrompt: ChatCompletionRequestMessage = {
      role: "system",
      content: `Create a ${mode} from the mindmap data, use only the labels. Connect the dots. Don't mention the mindmap
      `,
    };

    const userMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: nodeData.join(","),
    };

    const response = await fetch("/api/mindmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [systemPrompt, userMessage] }),
    });

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const stream = response.body;
    if (!stream) {
      return;
    }
    // console.log(stream);
    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let currentMessage = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      currentMessage += chunkValue;
      // console.log(currentMessage);
      mode === "summary"
        ? setSummary(currentMessage)
        : setEssay(currentMessage);
    }

    // console.log(currentMessage);
    setLoading(false);
  };

  return (
    <Sheet>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="shadow-md bg-white text-primary hover:bg-goodpink hover:text-white mx-2 space-x-2">
            <PencilLine></PencilLine>
            <p>Transform Writing</p>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>
            <SheetTrigger onClick={() => setMode("essay")}>
              <div className="flex space-x-2">
                <ScrollText></ScrollText>
                <p>Essay</p>
              </div>
            </SheetTrigger>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SheetTrigger onClick={() => setMode("summary")}>
              <div className="flex space-x-2">
                <Paperclip />
                <p>Summary</p>
              </div>
            </SheetTrigger>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <SheetContent className="">
        <SheetHeader>
          <SheetTitle>Here is your {mode}:</SheetTitle>
          <SheetDescription>
            <Button
              onClick={generateFromMindMap}
              className="bg-goodpink hover:bg-goodpink/75"
            >
              Generate{" "}
              {loading ? (
                <div className="ml-4">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                </div>
              ) : (
                <FlaskConical></FlaskConical>
              )}
            </Button>
            <div className="mt-5 w-full prose text-sm text-gray-700">
              <ReactMarkdown>
                {mode === "summary" ? summary : essay || ""}
              </ReactMarkdown>
            </div>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

const MindMapNavbar: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div>
      <div className="md:hidden">
        <div className="flex items-center pt-6 pb-4 px-4">
          <MobileSidebar />
          <div className="flex w-full justify-end">
            <UserButton afterSignOutUrl="/"></UserButton>
          </div>
        </div>
      </div>
      <div className="hidden md:inline">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center pl-6 pr-3">
              <div className="relative w-8 h-8 mr-4">
                <Image fill alt="Logo" src="/circle_brain_logo.png"></Image>
              </div>
              <h1 className="text-2xl font-bold text-goodpink">Creatify</h1>
            </Link>
          </div>
          <div className="flex items-center flex-grow self-center text-center justify-center justify-self-center">
            <h1 className="text-xl font-bold text-primary">{name}</h1>
          </div>
          <div className="flex items-center">
            {/* <SettingsButton /> */}

            {/* <Button className="shadow-md bg-white text-primary hover:bg-goodpink hover:text-white mx-2">
              Export
            </Button> */}

            <WritingButton />
            {/* <WritingButton mindmap={mindmap} /> */}

            <Dialog>
              <DialogTrigger asChild>
                <Button className="shadow-md bg-white text-primary hover:bg-goodpink hover:text-white mx-2">
                  <div className="flex space-x-2">
                    <Users></Users>
                    <p>Invite</p>
                  </div>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Invite others to brainstorm!</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input id="name" value="John Doe" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Email
                    </Label>
                    <Input
                      id="username"
                      value="johndoe@example.com"
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-goodpink hover:bg-goodpink/75"
                  >
                    Send invite!
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex items-center ml-2">
            <UserButton afterSignOutUrl="/"></UserButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindMapNavbar;
