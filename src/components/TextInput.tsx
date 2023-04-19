import { Container, RootContainer, Text } from "@coconut-xr/koestlich";
import { loadYoga } from "@coconut-xr/flex";
import { useState } from "react";
import { Input } from "@coconut-xr/input";
import Button from "./Button";
import { Configuration, OpenAIApi } from "openai";
import { AssistantStatus, useAssistantStore } from "../states/AssistantState";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_PUBLIC_OPENAI_API_KEY,
});

delete configuration.baseOptions.headers["User-Agent"];

const openai = new OpenAIApi(configuration);

function TextInput() {
  const [inputText, setinputText] = useState(
    "Would it have been a good idea to invest in Apple shares 10 years ago? ",
  );
  const [isPressed, setPressed] = useState(false);

  const [prompts, setAssistantStatus, addToPrompts] = useAssistantStore((assistantStore) => [
    assistantStore.prompts,
    assistantStore.changeStatus,
    assistantStore.addToPrompts,
  ]);

  const handleChange = (e: string) => {
    setinputText(e);
  };

  // Send ChatCompletion Request with the context and the previous converstation to OpenAi
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
        },
      );

      if (completion.data.choices[0].message) {
        return completion.data.choices[0].message;
      }
    } catch (error: any) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
  };

  // Send-Button-Down - Not Ideal to do it like this, i know :D
  const handleDown = (e: any) => {
    setPressed(true);
    setAssistantStatus(AssistantStatus.PROCESSING);
    addToPrompts({ role: "user", content: inputText });
  };

  // SendButton Up - Not Ideal to do it like this, i know :D
  const handleUp = (e: any) => {
    setPressed(false);
    sendRequest()
      .then((response) => {
        addToPrompts(response!);
      })
      .then(() => setAssistantStatus(AssistantStatus.PREPARINGTOSPEAK));
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
      <Input flexGrow={3} value={inputText} onChange={handleChange} overflow="hidden" />
      <Container translateY={-0.03} height={0.1}>
        <Button
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
        </Button>
      </Container>
    </RootContainer>
  );
}

export default TextInput;
