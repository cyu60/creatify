import { OpenAIStream, OpenAIStreamPayload } from "@/lib/openai-stream";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";
import { initialMessage } from "./constants";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const systemPrompt = "";
export async function POST(req: Request, res: Response) {
  try {
    // Check for user Id
    const { userId } = auth();
    const body = await req.json();
    console.log(body)
    const { messages } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (!configuration.apiKey) {
      return new NextResponse("API key not configured", { status: 500 });
    }
    if (!messages) {
      return new NextResponse("messages missing", { status: 400 });
    }

    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages,
    // });
    // // TODO: might want to return the functions as well?
    // return NextResponse.json(response.data.choices[0].message);

    // const { messages } = await req.json();

    // const parsedMessages = MessageArraySchema.parse(messages);

    // const outboundMessages: ChatGPTMessage[] = parsedMessages.map((message) => {
    //   return {
    //     role: message.isUserMessage ? "user" : "system",
    //     content: message.text,
    //   };
    // });
    // console.log(messages)

    const payload: OpenAIStreamPayload = {
      model: "gpt-3.5-turbo",
      messages: [...initialMessage, ...messages],
      temperature: 0.4,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: true,
      n: 1,
    };

    const stream = await OpenAIStream(payload);

    // // return NextResponse.(stream)
    return new Response(stream);
    
  } catch (err) {
    console.log(err);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
