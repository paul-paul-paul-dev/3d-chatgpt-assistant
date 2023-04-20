import { ChatCompletionRequestMessage } from "openai";
import { create } from "zustand";
import { assistantContext } from "./AssistantContext";

export enum AssistantStatus {
  IDLE,
  LISTENING,
  PROCESSING,
  PREPARINGTOSPEAK,
  RESPONDING,
}

// Return the Assistants color theme based on the status
export const getAssistantColor = (status: AssistantStatus) => {
  switch (status) {
    case AssistantStatus.IDLE:
      return "white";
    case AssistantStatus.LISTENING:
      return "lime";
    case AssistantStatus.PROCESSING:
      return "orange";
    case AssistantStatus.RESPONDING:
      return "lightblue";
  }
};

interface AssistantState {
  prompts: ChatCompletionRequestMessage[];
  status: AssistantStatus;
  addToPrompts: (newPrompt: ChatCompletionRequestMessage) => void;
  changeStatus: (newStatus: AssistantStatus) => void;
}

export const useAssistantStore = create<AssistantState>((set) => ({
  prompts: [
    assistantContext
  ],
  status: AssistantStatus.IDLE,
  addToPrompts: (newPrompt) =>
    set((assistantState) => ({
      prompts: [...assistantState.prompts, newPrompt],
    })),
  changeStatus: (newStatus) =>
    set(() => ({
      status: newStatus,
    })),
}));
