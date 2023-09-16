"use client"; // should be server side, but then it breaks the fetch?
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CreateMindMapButton from "@/components/CreateMindMapButton";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from "react";
import Empty from "@/components/Empty";
// import { MindMap } from "@/app/api/getmindmaps/route";

export type Mindmap = {
  _id: string;
  urlSlug: string;
  graphData: any;
  label: string;
};

type MindmapPreviewProps = {
  mindmaps: Mindmap[];
};

const MindmapPreview: React.FC<MindmapPreviewProps> = ({ mindmaps }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:pr-10">
      {mindmaps.map((mindmap) => (
        <MindmapCard key={mindmap._id} mindmap={mindmap} />
      ))}
    </div>
  );
};

export type MindmapProps = {
  mindmap: Mindmap;
};

const MindmapCard: React.FC<MindmapProps> = ({ mindmap }) => {
  return (
    <Link href={`/mindmap/${mindmap.urlSlug}`}>
      <Card>
        <CardHeader>
          <CardTitle>{mindmap.label}</CardTitle>
          <CardDescription>{mindmap.urlSlug}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Number of concepts: {mindmap.graphData.nodes.length}</p>
        </CardContent>
        {/* <CardFooter>
          <Link href={`/mindmap/${mindmap.urlSlug}`}>View</Link>
        </CardFooter> */}
      </Card>
    </Link>
  );
};
const MindmapCardSkeleton: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded mb-2 w-2/3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default function Dashboard() {
  const [mindmaps, setMindmaps] = useState<Mindmap[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMindMap = async () => {
      // Make api call to mindmap
      const res = await fetch(`/api/getmindmaps`);
      console.log("fetching body");
      const body = await res.json();
      if (body.worked) {
        console.log(body.mindMaps);
      }
      console.log("done");
      setMindmaps(body.mindMaps);
      setIsLoading(false);
    };
    if (typeof window !== "undefined") {
      fetchMindMap();
    }
  }, []);

  return (
    <div className="h-full relative">
      <div className="hidden h-full md:flex md:flex-col md:fixed md:inset-y-0 z-[80] bg-goodpink">
        <div>
          <Sidebar></Sidebar>
        </div>
      </div>
      <main className="md:pl-64">
        <Navbar></Navbar>
        <div>
          <div className="ml-4 my-2 md:hidden">
            <CreateMindMapButton />
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 md:pr-10">
              <MindmapCardSkeleton />
              <MindmapCardSkeleton />
              <MindmapCardSkeleton />
              <MindmapCardSkeleton />
            </div>
          ) : mindmaps?.length > 0 ? (
            <MindmapPreview mindmaps={mindmaps} />
          ) : (
            <Empty label="Create your first Mindmap" />
          )}
        </div>
      </main>
    </div>
  );
}
