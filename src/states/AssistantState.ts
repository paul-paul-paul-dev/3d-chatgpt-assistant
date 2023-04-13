import { ChatCompletionRequestMessage } from "openai";
import { create } from "zustand";

export enum AssistantStatus {
  IDLE,
  LISTENING,
  PROCESSING,
  PREPARINGTOSPEEK,
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
    {
      role: "system",
      content:
        "You are a personal finance assistant called Paul." +
        "You are programmed for virtual and augmented reality environments. " +
        "Keep your answers short but informative. " 
        // "Be a little bit funny while explaining, talking or responding. ",
    },
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
