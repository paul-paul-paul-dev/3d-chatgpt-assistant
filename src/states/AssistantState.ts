import { ChatCompletionRequestMessage } from "openai";
import { create } from "zustand";

export enum AssistantStatus {
  IDLE,
  LISTENING,
  PROCESSING,
  RESPONDING,
}

interface AssistantState {
  prompts: ChatCompletionRequestMessage[];
  status: AssistantStatus;
  addToPrompts: (newPrompt: ChatCompletionRequestMessage) => void;
  changeStatus: (newStatus: AssistantStatus) => void
}

export const useAssistantStore = create<AssistantState>((set) => ({
  prompts: [
    {
      role: "system",
      content:
        "You are a personal finance assistant called Paul. You are programmed for virtual and augmented reality environments. Answer in sophisticated business English and add financial facts to your answers from time to time.",
    },
  ],
  status: AssistantStatus.IDLE,
  addToPrompts: (newPrompt) =>
    set((assistantState) => ({
      prompts: [...assistantState.prompts, newPrompt],
    })),
  changeStatus: (newStatus) => set(() => ({
    status: newStatus,
  })),
}));
