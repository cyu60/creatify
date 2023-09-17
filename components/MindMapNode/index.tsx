import { useLayoutEffect, useEffect, useRef, useState } from "react";
import { Handle, NodeProps, Position, useStoreApi } from "reactflow";

import { BrainCircuitIcon, GripVertical, Trash2, Plus } from "lucide-react";
import { Button } from "../ui/button";
import { ChatCompletionRequestMessage } from "openai";
import useStore from "@/lib/store";
import Image from "next/image";
import axios from "axios";

export type NodeData = {
  label: string;
};

function MindMapNode({ id, data }: NodeProps<NodeData>) {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const updateNodeLabel = useStore((state) => state.updateNodeLabel);
  const addChildNode = useStore((state) => state.addChildNode);
  const deleteSelfAndChildren = useStore(
    (state) => state.deleteSelfAndChildren
  );

  const store = useStoreApi();
  const [rows, setRows] = useState(1);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current?.focus({ preventScroll: true });
    }, 1);
  }, []);

  useLayoutEffect(() => {
    if (inputRef.current) {
      inputRef.current.style.width = `${data.label.length * 8 + 120}px`;
      // currently takes about 25 characters per line so we want to divide by 25 and ceil it. Multiply since we need padding and stuff
      // inputRef.current.style.height = `${
      //   Math.ceil(data.label.length / 25) + 1.5
      // }em`;
      const length = data.label.length + 1;
      setRows(Math.ceil(length / 25));
    }
  }, [data.label.length]);

  // const handleAddChild = () => {
  //   // Call the Zustand action to add a child node
  //   addChildNode(id, { x: Math.random() * 500, y: Math.random() * 500 }); // Pass the id or any other required parameters
  // };

  const handleHelper = async (guidingPrompt: string) => {
    // logic to add child
    const { nodeInternals } = store.getState();

    const parentNode = nodeInternals.get(id)!;
    let newPosition = {
      x: parentNode.position.x,
      y: parentNode.position.y + 10,
    };
    // Fetch existing siblings from the store
    const sibling_labels: string[] = [];

    nodeInternals.forEach((node) =>
      node.parentNode === parentNode.id
        ? sibling_labels.push(node.data.label)
        : null
    );

    const newNode = addChildNode(parentNode, "", newPosition);

    const systemPrompt: ChatCompletionRequestMessage = {
      role: "system",
      content: `${guidingPrompt} Already considered: ${sibling_labels.join(
        ", "
      )}`,
    };

    const userMessage: ChatCompletionRequestMessage = {
      role: "user",
      content: parentNode.data.label,
    };

    const response = await fetch("/api/mindmap", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: [systemPrompt, userMessage] }),
    });
    
    console.log("user message:");
    console.log(userMessage);
    const imgResponse = await axios.post("/api/replicate", userMessage);
    console.log("This is the image response");
    console.log(imgResponse);

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
      updateNodeLabel(newNode.id, currentMessage);
    }
  };

  const handleOnQuestion = async () => {
    await handleHelper(
      "Ask 1 insightful socratic question about the statement."
    );
  };

  const handleOnExplain = async () => {
    await handleHelper(
      "Explain this statement like I am a college student. Keep it short and sweet, as concise as possible."
    );
  };

  const handleOnDelete = () => {
    deleteSelfAndChildren(id);
  };

  const handleOnSuggestion = async () => {
    await handleHelper(
      "Give a suggestion on how to answer the statement. Keep it short and sweet."
    );
  };

  return (
    <>
      <div className="inputWrapper content-center group">
      <div className="dragHandle">
            <GripVertical color="white"></GripVertical>
          </div>
        <div className="grid grid-rows-2 grid-flow-col gap-4">
        <div>
          {id !== "root" && (
            <Button
              onClick={() => handleOnDelete()}
              className="absolute bg-goodpink hover:bg-niceyellow left-[-75px] hidden group-focus-within:inline"
            >
              <Trash2 />
            </Button>
          )}
          <Button
            onClick={() => handleOnSuggestion()}
            className="absolute bg-goodpink hover:bg-niceyellow right-[-75px] hidden group-focus-within:inline"
          >
            <Plus />
          </Button>
          
          
          <textarea
            placeholder="New Concept"
            value={data.label}
            onChange={(evt) => updateNodeLabel(id, evt.target.value)}
            className="border-none px-0.5 rounded-sm font-bold bg-transparent max-w-sm h-fit text-white focus:border-none focus:outline-none focus:bg-opacity-25 focus:bg-white"
            ref={inputRef}
            rows={rows}
          />
          <Button
            onClick={() => handleOnQuestion()}
            className="rounded bg-white hover:bg-niceyellow ml-2"
          >
            <Image src="/question.svg" alt="Icon" width={20} height={20} />
          </Button>
          <Button
            onClick={() => handleOnExplain()}
            className="rounded bg-white hover:bg-niceyellow ml-2"
          >
            <img src="/Group.svg" alt="Icon" width={20} height={20} />
          </Button>
          
        </div>
        <div>
          <img style={{maxWidth:200}} src="https://zhizdev.github.io/personal_webpage/zhizhuo_2021_small.jpeg"></img>
        </div>
        </div>

          
      </div>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </>
  );
}

export default MindMapNode;
