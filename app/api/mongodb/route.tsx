import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

interface MindMap {
  urlSlug: string;
  label: string;
  graphData: object;
}

const databaseName = "users";
const client = await MongoClient.connect(process.env.MONGODB_URI as string);
const db: Db = client.db(databaseName);

// GET /api/mongodb
// Gets all the mindmaps of a user.
export async function GET(req: Request, res: Response) {
  try {
    // Check for user Id
    const { userId } = auth();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const collection = db.collection<MindMap>(userId);
    const existingMindMap = await collection.findOne(
      { urlSlug: slug as string },
      { projection: { _id: 0 } }
    );
    if (existingMindMap) {
      const result = {
        worked: true,
        existingMindMap: existingMindMap,
      };
      return new NextResponse(JSON.stringify(result), { status: 200 });
    }
    // for the dashboard:
    // const mindMaps = await collection.find().toArray();

    return new NextResponse(JSON.stringify({ worked: false }), { status: 200 });
  } catch (err) {
    console.log("error");
    console.log(err);
    console.log("error");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function POST(req: Request, res: Response) {
  // TODO: make sure rate-limit, this spams like requests everytime a single character is changed.
  try {
    // Check for user Id
    const { userId } = auth();
    const body = await req.json();
    const { slug, label, state } = body;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const collection = db.collection<MindMap>(userId);

    // create a filter for a movie to update
    const filter = { urlSlug: slug };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };
    const updateDoc = {
      $set: {
        urlSlug: slug,
        label: label,
        graphData: state,
      },
    };
    const result = await collection.updateOne(filter, updateDoc, options);

    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.log("error");
    console.log(err);
    console.log("error");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
