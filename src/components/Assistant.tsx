import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";
import {
  AssistantStatus,
  getAssistantColor,
  useAssistantStore,
} from "../states/AssistantState";

type MyAssistantProps = {};

export default function Assistant(
  props: JSX.IntrinsicElements["mesh"] & MyAssistantProps
) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null!);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  const textToSpeech = new SpeechSynthesisUtterance();

  const [prompts, assistantStatus, setAssistantStatus, addToPrompts] =
    useAssistantStore((assistantStore) => [
      assistantStore.prompts,
      assistantStore.status,
      assistantStore.changeStatus,
      assistantStore.addToPrompts,
    ]);

  const handleClick = () => {
    click(!clicked);
    if (assistantStatus === AssistantStatus.IDLE) {
      setAssistantStatus(AssistantStatus.LISTENING);
    } else if (assistantStatus === AssistantStatus.LISTENING) {
      setAssistantStatus(AssistantStatus.IDLE); // or processing
    }
  };

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame(
    (state, delta) =>
      (ref.current.rotation.x +=
        assistantStatus === AssistantStatus.LISTENING ? delta * 2 : delta)
  );

  useEffect(() => {
    if (assistantStatus === AssistantStatus.RESPONDING) {
      // query for google text-to-speech
      if (prompts.at(-1)) {
        textToSpeech.text = prompts.at(-1)!.content;
        console.log("Speeking")
        window.speechSynthesis.speak(textToSpeech);
        setAssistantStatus(AssistantStatus.IDLE)
      }
    }
  });

  return (
    <mesh
      {...props}
      ref={ref}
      scale={clicked ? 0.8 : 0.75}
      onClick={(event) => handleClick()}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <sphereGeometry args={[1, 24]} />
      <meshStandardMaterial color={getAssistantColor(assistantStatus)} />
    </mesh>
  );
}
