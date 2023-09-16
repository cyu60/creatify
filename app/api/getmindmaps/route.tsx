import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { MongoClient, Db } from "mongodb";

export interface MindMap {
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

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const collection = db.collection<MindMap>(userId);

    // Fetch all mindmaps for the dashboard
    const mindMaps = await collection.find().toArray();

    if (mindMaps.length > 0) {
      const result = {
        worked: true,
        mindMaps: mindMaps,
      };
      return new NextResponse(JSON.stringify(result), { status: 200 });
    }

    return new NextResponse(
      JSON.stringify({ worked: false, message: "No mindmaps found" }),
      { status: 200 }
    );
  } catch (err) {
    console.log("error");
    console.log(err);
    console.log("error");
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
