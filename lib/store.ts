import {
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  OnNodesChange,
  OnEdgesChange,
  applyNodeChanges,
  applyEdgeChanges,
  XYPosition,
} from "reactflow";
import { create } from "zustand";
import { nanoid } from "nanoid/non-secure";
import { NodeData } from "@/components/MindMapNode";

export type RFState = {
  slug: string;
  setSlug: (slug: string) => void;
  nodes: Node<NodeData>[];
  edges: Edge[];
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeLabel: (nodeId: string, label: string) => void;
  updateNodeImage: (nodeId: string, image_url: string) => void;
  addChildNode: (parentNode: Node, label: string, position: XYPosition) => Node;
  deleteSelfAndChildren: (nodeId: string) => void;
};

export const initialState: RFState = {
  slug: "",
  setSlug: () => {},
  nodes: [
    {
      id: "root",
      type: "mindmap",
      data: { label: "What would you like to explore?" , image_url:"null"},
      position: { x: 0, y: 0 },
      dragHandle: ".dragHandle",
    },
  ],
  edges: [],
  onNodesChange: () => {},
  onEdgesChange: () => {},
  updateNodeLabel: () => {},
  updateNodeImage: () => {},
  addChildNode: () => ({
    id: "",
    type: "",
    data: { label: "" , image_url:"null"},
    position: { x: 0, y: 0 },
  }),
  deleteSelfAndChildren: () => {},
};

let saveTimeout: NodeJS.Timeout | null = null;
// Save state to mongodb
const saveState = async (state: RFState) => {
  try {
    // Clear any existing timeout
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }

    // Set a new timeout to delay the execution of saveState
    saveTimeout = setTimeout(async () => {
      console.log("Saving state");
      const body = JSON.stringify({
        slug: state.slug,
        label: state.slug,
        state: state,
      });
      await fetch("/api/mongodb", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: body,
      });
      console.log("Saved state");
    }, 1000); // Delay time in milliseconds
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const useStore = create<RFState>((set, get) => {
  return {
    ...initialState,
    setSlug: (slug: string) => {
      set({ slug: slug });
    },
    onNodesChange: (changes: NodeChange[]) => {
      const newNodes = applyNodeChanges(changes, get().nodes);
      set({ nodes: newNodes });
      saveState({ ...get(), nodes: newNodes });
    },
    onEdgesChange: (changes: EdgeChange[]) => {
      const newEdges = applyEdgeChanges(changes, get().edges);
      set({ edges: newEdges });
      saveState({ ...get(), edges: newEdges });
    },
    updateNodeLabel: (nodeId: string, label: string) => {
      const newNodes = get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, label };
        }
        return node;
      });
      set({ nodes: newNodes });
      saveState({ ...get(), nodes: newNodes });
    },
    updateNodeImage: (nodeId: string, image_url: string) => {
      const newNodes = get().nodes.map((node) => {
        if (node.id === nodeId) {
          node.data = { ...node.data, image_url};
        }
        return node;
      })
      set({ nodes: newNodes });
      saveState({ ...get(), nodes: newNodes });
      
    },
    addChildNode: (parentNode: Node, label: string, position: XYPosition) => {
      const newNode = {
        id: nanoid(),
        type: "mindmap",
        data: { label: label },
        position,
        dragHandle: ".dragHandle",
        parentNode: parentNode.id,
      };

      const newEdge = {
        id: nanoid(),
        source: parentNode.id,
        target: newNode.id,
      };

      const newNodes = [...get().nodes, newNode];
      const newEdges = [...get().edges, newEdge];

      set({
        nodes: newNodes,
        edges: newEdges,
      });

      saveState({ ...get(), nodes: newNodes, edges: newEdges });

      return newNode;
    },
    deleteSelfAndChildren: (nodeId: string) => {
      const deleteNodeAndChildren = (
        node: Node<NodeData>,
        newNodes: Node<NodeData>[],
        newEdges: Edge[]
      ) => {
        const children = newNodes.filter((n) => n.parentNode === node.id);
        for (const child of children) {
          const { newNodes: updatedNodes, newEdges: updatedEdges } =
            deleteNodeAndChildren(child, newNodes, newEdges);
          newNodes = updatedNodes;
          newEdges = updatedEdges;
        }

        newNodes = newNodes.filter((n) => n.id !== node.id);
        newEdges = newEdges.filter(
          (edge) => edge.source !== node.id && edge.target !== node.id
        );

        return { newNodes, newEdges };
      };

      if (nodeId === "root") {
        return;
      }

      const nodeToDelete = get().nodes.find((node) => node.id === nodeId);
      if (nodeToDelete) {
        const { newNodes, newEdges } = deleteNodeAndChildren(
          nodeToDelete,
          get().nodes,
          get().edges
        );
        set((state) => ({
          nodes: newNodes,
          edges: newEdges,
        }));
        saveState({ ...get(), nodes: newNodes, edges: newEdges });
      }
    },
  };
});

export default useStore;
