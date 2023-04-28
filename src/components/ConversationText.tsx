import { Container, Text } from "@coconut-xr/koestlich";
import { useAssistantStore } from "../states/AssistantState";
import { ChatCompletionRequestMessage, ChatCompletionRequestMessageRoleEnum } from "openai";
import { useEffect, useReducer, useState } from "react";
import Card from "../objects/Card";

interface ConvoState {
  assistant: string;
  user: string;
}

type ConvoAction =
  | { type: "updateAssistant"; payload: string }
  | { type: "updateUser"; payload: string };

export default function ConversationText() {
  const [prompts] = useAssistantStore((assistantStore) => [assistantStore.prompts]);

  const initialState = { assistant: "", user: "" };

  const [convo, dispatch] = useReducer(reducer, initialState);

  function reducer(state: ConvoState, action: ConvoAction) {
    switch (action.type) {
      case "updateAssistant":
        return { ...state, assistant: action.payload };
      case "updateUser":
        return { ...state, user: action.payload };
      default:
        return state;
    }
  }

  useEffect(() => {
    const lastPrompt = prompts[prompts.length - 1];
    if (lastPrompt.role === ChatCompletionRequestMessageRoleEnum.Assistant) {
      dispatch({ type: "updateAssistant", payload: lastPrompt.content });
    } else if (lastPrompt.role === ChatCompletionRequestMessageRoleEnum.User) {
      dispatch({ type: "updateUser", payload: lastPrompt.content });
    }
  }, [prompts]);

  return (
    <Container flexGrow={3} margin={0.2} backgroundColor="white">
      <Card radius={10} ratio={2} flexGrow={1} padding={0.2} flexDirection="column">
        <Container flexDirection="row"><Text fontSize={0.2}>{`User: ${convo.user}`}</Text></Container>
        <Container flexDirection="row"><Text fontSize={0.2}>{`Assistant: ${convo.assistant}`}</Text></Container>

        </Card>
    </Container>
  );
}
