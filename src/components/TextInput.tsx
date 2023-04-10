import { Container, RootContainer, Text } from "@coconut-xr/koestlich";
import { loadYoga } from "@coconut-xr/flex";
import { useState } from "react";
import { Input } from "@coconut-xr/input";
import Card from "./Card";
import { Configuration, OpenAIApi } from "openai";
import { AssistantStatus, useAssistantStore } from "../states/AssistantState";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_PUBLIC_OPENAI_API_KEY_WHISPER,
});

delete configuration.baseOptions.headers["User-Agent"];

const openai = new OpenAIApi(configuration);

function TextInput() {
  const [inputText, setinputText] = useState("Give me 3 essential investing tips for beginners!");
  const [isPressed, setPressed] = useState(false);

  const [prompts, setAssistantStatus, addToPrompts] =
    useAssistantStore((assistantStore) => [
      assistantStore.prompts,
      assistantStore.changeStatus,
      assistantStore.addToPrompts,
    ]);

  const handleChange = (e: string) => {
    setinputText(e);
  };

  const sendRequest = async () => {
    console.log("Send Request:");
    console.log(prompts);
    try {
      const completion = await openai.createChatCompletion(
        {
          model: "gpt-3.5-turbo",
          messages: prompts,
          temperature: 0,
        },
        {
          timeout: 30000,
        }
      );

      if (completion.data.choices[0].message) {
        return completion.data.choices[0].message;
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status)
        console.log(error.response.data)
      } else {
        console.log(error.message)
      }
    }
  };

  const handleDown = (e: any) => {
    setPressed(true);
    setAssistantStatus(AssistantStatus.PROCESSING)
    addToPrompts({ role: "user", content: inputText })
  };

  const handleUp = (e: any) => {
    setPressed(false);
    sendRequest()
    .then((response) => {
      addToPrompts(response!)
    })
    .then(() => setAssistantStatus(AssistantStatus.PREPARINGTOSPEEK));
  };

  return (
    <RootContainer
      loadYoga={loadYoga}
      backgroundColor="white"
      width={4}
      height={1}
      flexDirection="column"
      translateX={-7.5}
      borderRadius={0.1}
      padding={0.1}
    >
      <Input
        flexGrow={3}
        value={inputText}
        onChange={handleChange}
        overflow="hidden"
      />
      <Container translateY={-0.03} height={0.1}>
        <Card
          radius={1}
          ratio={1}
          height={0.1}
          flexGrow={1}
          backgroundColor="lightblue"
          justifyContent="space-evenly"
          alignItems="center"
          borderRadius={0.1}
          isPressed={isPressed}
          onPointerDown={handleDown}
          onPointerUp={handleUp}
        >
          <Text fontSize={0.1} color={"black"}>
            Send
          </Text>
        </Card>
      </Container>
    </RootContainer>
  );
}

export default TextInput;
