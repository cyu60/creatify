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
  nodes: Node<NodeData>[];
  edges: Edge[];
  currentMindMapId: string;
  setCurrentMindMapId: (newId: string) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  updateNodeLabel: (nodeId: string, label: string) => void;
  addChildNode: (parentNode: Node, label: string, position: XYPosition) => Node;
};

const initialState: RFState = {
  nodes: [
    {
      id: "root",
      type: "mindmap",
      data: { label: "What would you like to explore?" },
      position: { x: 0, y: 0 },
      dragHandle: ".dragHandle",
    },
  ],
  edges: [],
  currentMindMapId: "1",
  setCurrentMindMapId: () => {},
  onNodesChange: () => {},
  onEdgesChange: () => {},
  updateNodeLabel: () => {},
  addChildNode: () => ({
    id: "",
    type: "",
    data: { label: "" },
    position: { x: 0, y: 0 },
  }),
};

// Load initial state from Local Storage or use default
const loadState = (mindMapId: string): RFState => {
  try {
    const serializedState = localStorage.getItem(`mindMapState_${mindMapId}`);
    if (serializedState === null) {
      console.log(`mindMapState_${mindMapId} is being created`);
      // return { ...initialState };
      return { ...initialState, currentMindMapId: mindMapId };
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error("Could not load state", err);
    return { ...initialState };
  }
};

// Save state to Local Storage
const saveState = (state: RFState) => {
  try {
    const { currentMindMapId, ...stateToSave } = state;
    const serializedState = JSON.stringify(stateToSave);

    console.log("Saving the state now...");
    console.log(state.currentMindMapId, serializedState);
    localStorage.setItem(
      `mindMapState_${state.currentMindMapId}`,
      serializedState
    );
  } catch (err) {
    console.error("Could not save state", err);
  }
};

const useStore = create<RFState>((set, get) => {
  const loadedState = loadState("1"); // Set default mindMapId here

  return {
    ...loadedState,
    setCurrentMindMapId: (newId: string) => {
      const newState = loadState(newId);
      set({ ...newState, currentMindMapId: newId });
    },
    onNodesChange: (changes: NodeChange[]) => {
      // How  do I expose the currentMapId here?
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
    addChildNode: (parentNode: Node, label: string, position: XYPosition) => {
      console.log("addChildNode");
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
  };
});

export default useStore;
