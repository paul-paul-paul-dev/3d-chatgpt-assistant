import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Assitant from "./components/Assistant";
import { inputCanvasProps } from "@coconut-xr/input";
import { Container, RootContainer, Text } from "@coconut-xr/koestlich";
import { loadYoga } from "@coconut-xr/flex";
import { Button, Select } from "@coconut-xr/kruemel";
import { useState } from "react";
import Ticker from "./components/Ticker";
import ConversationText from "./components/ConversationText";
import Card from "./objects/Card";

function App() {
  const handleClick = () => {
    console.log("test");
  };

  const [voice, setVoice] = useState(146);

  const selectOptions = [
    { value: 146, label: "UK English Male" },
    { value: 145, label: "UK English Female" },
    { value: 14, label: "Daniel" },
  ];

  return (
    <>
      <Canvas {...inputCanvasProps}>
        <ambientLight intensity={0.5} />
        <pointLight
          position={[200, 200, 400]}
          intensity={0.7}
          castShadow
          shadow-camera-far={10000}
          shadow-camera-near={1}
          shadow-mapSize={2048}
        />

        <Assitant position={[0, 1, 0]} voice={voice} />
        <RootContainer
          translateX={-50}
          translateZ={-1}
          translateY={65}
          loadYoga={loadYoga}
          backgroundColor="white"
          width={10}
          height={10}
          flexDirection="column"
          borderRadius={0.2}
        >
          <Card radius={10} ratio={4} flexGrow={1}>
            <Text fontSize={0.3} horizontalAlign="center" margin={0.1}>
              3D-AI-Assistant
            </Text>
            <Ticker />
            <Container flexGrow={5} margin={0.2} backgroundColor="white" />
            <Container
              flexGrow={3}
              margin={0.2}
              padding={0.1}
              backgroundColor="white"
              borderRadius={0.2}
              flexDirection="column"
            >
              <ConversationText />
              {/* <Container flexGrow={1} margin={0.2} backgroundColor="white">
              <Button
                marginBottom={0.4}
                fontSize={0.2}
                horizontalAlign="center"
                onClick={handleClick}
                backgroundColor={"darkgray"}
                border={0.03}
                borderColor={"gray"}
                borderRadius={0.1}
                color={"black"}
              >
                Test-Button
              </Button>
              <Select value={voice} onChange={setVoice} backgroundColor={"darkgray"} color={"black"} options={selectOptions} />
            </Container> */}
            </Container>
          </Card>
        </RootContainer>
        <OrbitControls enableRotate={false} zoom0={10} />
      </Canvas>
    </>
  );
}

export default App;
