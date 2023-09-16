"use client";

import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import axios from "axios";
import ReactMarkdown from "react-markdown";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import Header from "@/components/Header";
import { Lightbulb } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ChatCompletionRequestMessage } from "openai";
// import { initialMessage, systemPrompt, testMessages } from "../../../api/ideation/constants";
import Empty from "@/components/Empty";
import Loader from "@/components/Loader";
import { cn } from "@/lib/utils";
import { codeGeneration } from "@/lib/constants";

const formSchema = z.object({
  prompt: z.string().min(1, {
    message: "Please let me know what your initial idea is.",
  }),
});

export default function ProfileForm() {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState("");
  const [messages, setMessages] = useState<ChatCompletionRequestMessage[]>([
    // ...initialMessage,
    // ...testMessages,
  ]);
  // Create a form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  // Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userMessage: ChatCompletionRequestMessage = {
        role: "user",
        content: values.prompt,
      };
      const newMessages = [...messages, userMessage];

      // const response = await axios.post("/api/ideation", {
      //   messages: newMessages,
      // });
      // setMessages((current) => [...current, userMessage, response.data]);

      const response = await fetch("/api/code", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: newMessages }),
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
        setCurrentMessage((prev) => prev + chunkValue);
        // console.log(currentMessage);
      }
      setMessages((current) => [
        ...current,
        userMessage,
        { role: "assistant", content: currentMessage },
      ]);
      setCurrentMessage("");

      form.reset();
    } catch (error: any) {
      // TODO: handle pro plan?
      console.log(error);
    } finally {
      router.refresh();
    }
  }

  return (
    <div className="">
      <Header
        title={codeGeneration.label}
        icon={codeGeneration.icon}
        description={codeGeneration.description}
        iconColor={codeGeneration.color}
        bgColor={codeGeneration.bgColor}
      ></Header>
      <div className="px-4 lg:px-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-lg border w-full p-4 px-3 md:px-6 focus-within:shadow-sm grid grid-cols-12 gap-2"
          >
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem className="col-span-12 lg:col-span-10">
                  <FormControl>
                    <Input
                      placeholder="python code that calls OpenAI api..."
                      {...field}
                      className="outline-none border-none focus-visible:ring-transparent"
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="col-span-12 lg:col-span-2 w-full"
              disabled={isLoading}
            >
              Generate
            </Button>
          </form>
        </Form>

        {/* {!!isLoading && <Loader></Loader>} */}
        {messages.length < 2 && !isLoading && (
          <Empty label={"Waiting for your code idea!"}></Empty>
        )}
        {!!currentMessage && (
          <div
            className={cn("flex w-full p-8 my-3 rounded-lg", "bg-slate-300")}
          >
            <div className="w-full prose text-sm text-gray-700">
              <ReactMarkdown
                components={{
                  pre: ({ node, ...props }) => (
                    <div className="overflow-auto w-full my-2 bg-black/10 p-2 rounded-lg">
                      <pre {...props} />
                    </div>
                  ),
                  code: ({ node, ...props }) => (
                    <code className="bg-black/10 rounded-lg p-1" {...props} />
                  ),
                }}
                className="text-sm overflow-hidden leading-7"
              >
                {currentMessage || ""}
              </ReactMarkdown>
            </div>
          </div>
        )}
        <div className="flex flex-col-reverse">
          {messages.map(
            (m) =>
              m.role !== "system" && (
                <div
                  key={m.content}
                  className={cn(
                    "flex w-full p-8 my-3 rounded-lg",
                    m.role === "user" ? "bg-white border" : "bg-slate-300"
                  )}
                >
                  <div className="w-full prose text-sm text-gray-700">
                    <ReactMarkdown>{m.content || ""}</ReactMarkdown>
                  </div>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
}
