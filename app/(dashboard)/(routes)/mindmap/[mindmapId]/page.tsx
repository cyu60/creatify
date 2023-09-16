"use client";

import { use, useCallback, useEffect, useRef, useState } from "react";
import ReactFlow, {
  ConnectionLineType,
  NodeOrigin,
  Node,
  OnConnectEnd,
  OnConnectStart,
  useReactFlow,
  useStoreApi,
  Controls,
  Panel,
} from "reactflow";
import { shallow } from "zustand/shallow";

import useStore, { RFState, initialState } from "../../../../../lib/store";

// we need to import the React Flow styles to make it work
import "reactflow/dist/style.css";
import "./index.css";
import MindMapNode from "@/components/MindMapNode";
import MindMapEdge from "@/components/MindMapEdge";
import { nanoid } from "nanoid/non-secure";
import { useParams } from "next/navigation";
import MindMapNavbar from "@/components/MindMapNavbar";
import Loader from "@/components/Loader";
import { MindMap } from "@/app/api/getmindmaps/route";
import { Mindmap } from "../../dashboard/page";

const selector = (state: RFState) => ({
  nodes: state.nodes,
  edges: state.edges,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  addChildNode: state.addChildNode,
  // setCurrentMindmapId: state.setCurrentMindMapId,
});

const nodeTypes = {
  mindmap: MindMapNode,
};

const edgeTypes = {
  mindmap: MindMapEdge,
};

const nodeOrigin: NodeOrigin = [0.5, 0.5];

const connectionLineStyle = { stroke: "#983164", strokeWidth: 3 };
const defaultEdgeOptions = { style: connectionLineStyle, type: "mindmap" };

const proOptions = { hideAttribution: true };

function Flow() {
  const params = useParams();

  const store = useStoreApi();
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    addChildNode,
    // setCurrentMindmapId,
  } = useStore(selector, shallow);
  const { project } = useReactFlow();
  const connectingNodeId = useRef<string | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [mindMap, setMindmap] = useState<Mindmap>();

  useEffect(() => {
    const fetchMindMap = async () => {
      const res = await fetch(`/api/mongodb?slug=${params.mindmapId}`);
      console.log("fetching body");
      const body = await res.json();
      if (body.worked) {
        console.log(body.existingMindMap.graphData);
        useStore.setState({
          nodes: body.existingMindMap.graphData.nodes,
          edges: body.existingMindMap.graphData.edges,
        });
        console.log("loaded prev state");
      }
      console.log("done");
      setMindmap(body.existingMindMap);
      setIsMounted(true);
    };
    if (typeof window !== "undefined") {
      fetchMindMap();
    }
  }, []);

  // useEffect(() => setCurrentMindmapId(params.mindmapId as string), []); // Might need to conditionally stop this??

  const getChildNodePosition = (event: MouseEvent, parentNode?: Node) => {
    const { domNode } = store.getState();

    if (
      !domNode ||
      // we need to check if these properites exist, because when a node is not initialized yet,
      // it doesn't have a positionAbsolute nor a width or height
      !parentNode?.positionAbsolute ||
      !parentNode?.width ||
      !parentNode?.height
    ) {
      return;
    }

    const { top, left } = domNode.getBoundingClientRect();

    // we need to remove the wrapper bounds, in order to get the correct mouse position
    const panePosition = project({
      x: event.clientX - left,
      y: event.clientY - top,
    });

    // we are calculating with positionAbsolute here because child nodes are positioned relative to their parent
    return {
      x: panePosition.x - parentNode.positionAbsolute.x + parentNode.width / 2,
      y: panePosition.y - parentNode.positionAbsolute.y + parentNode.height / 2,
    };
  };

  const onConnectStart: OnConnectStart = useCallback((_, { nodeId }) => {
    // we need to remember where the connection started so we can add the new node to the correct parent on connect end
    connectingNodeId.current = nodeId;
  }, []);

  const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const { nodeInternals } = store.getState();
      const targetIsPane = (event.target as Element).classList.contains(
        "react-flow__pane"
      );
      const node = (event.target as Element).closest(".react-flow__node");

      if (node) {
        node.querySelector("textarea")?.focus({ preventScroll: true });
      } else if (targetIsPane && connectingNodeId.current) {
        const parentNode = nodeInternals.get(connectingNodeId.current);
        const childNodePosition = getChildNodePosition(
          event as MouseEvent,
          parentNode
        );

        if (parentNode && childNodePosition) {
          addChildNode(parentNode, "New Concept", childNodePosition);
        }
      }
    },
    [getChildNodePosition]
  );

  const handleNodeClick = () => {
    const { nodeInternals } = store.getState();

    // console.log("test");

    // addChildNode(nodeInternals.get(id)!, {
    //   x: Math.random() * 500,
    //   y: Math.random() * 500,
    // });

    // const filterNodeswithSameSource = nodes.filter(
    //   (node) => node?.data?.parentId === data?.id
    // );

    // setNodes((nds) =>
    //   nds.concat({
    //     id: nanoid(),
    //     type: "default",
    //     position: {
    //       x: data.position.x + filterNodeswithSameSource.length * 160,
    //       y: data.position.y + 100,
    //     },
    //     data: { label: "New Node", parentId: data.id },
    //     width: 150,
    //   })
    // );
    // setAddChildeNode(true);
    // setParentNode(data);
  };

  console.log("params", params.mindmapId);
  const setSlug = useStore((state) => state.setSlug);
  setSlug(params.mindmapId as string);

  if (!isMounted) {
    return <Loader></Loader>;
  }

  return (
    <div className="h-screen flex flex-col ">
      <MindMapNavbar name={mindMap?.label || "New Concepify"} />
      <div className="flex-grow">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnectStart={onConnectStart}
          onConnectEnd={onConnectEnd}
          onNodeClick={handleNodeClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          nodeOrigin={nodeOrigin}
          defaultEdgeOptions={defaultEdgeOptions}
          connectionLineStyle={connectionLineStyle}
          connectionLineType={ConnectionLineType.Straight}
          fitView
          proOptions={proOptions}
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </div>
    </div>
  );
}

export default Flow;
