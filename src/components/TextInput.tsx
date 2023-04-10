import { Container, RootContainer, Text } from "@coconut-xr/koestlich";
import { loadYoga } from "@coconut-xr/flex";
import { useState } from "react";
import { Input } from "@coconut-xr/input";
import Card from "./Card";

function TextInput() {
  const [text1, setText1] = useState("Input Field");
  const [isPressed, setPressed] = useState(false);

  const handleChange = (e: string) => {
    console.log(e);
    setText1(e);
  };

  const sendRequest = () => {
    console.log("Send Request");
  };

  const handleDown = (e: any) => {
    setPressed(true);
    sendRequest();
  };

  const handleUp = (e: any) => {
    setPressed(false);
  };

  return (
    <RootContainer
      loadYoga={loadYoga}
      backgroundColor="white"
      width={2}
      height={1}
      flexDirection="row"
      translateX={-4.5}
      borderRadius={0.1}
      padding={0.1}
    >
      <Input
        flexGrow={3}
        value={text1}
        onChange={handleChange}
        maxWidth={1.2}
        overflow="hidden"
      />
      <Container translateX={0.16} translateY={-0.07} height={0.1}>
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
