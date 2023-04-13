import { useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import { AssistantStatus, getAssistantColor, useAssistantStore } from "../states/AssistantState";

type MyAssistantProps = {};
export default function Assistant(props: JSX.IntrinsicElements["mesh"] & MyAssistantProps) {
  const ref = useRef<Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // TTS Setup
  const tts = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  tts.voice = voices[146];
  /* Good Voices : 
  14: Daniel en-US - Use this if you want the assistant to react to what he is saying. Google SpeechSynth can't do that...
  140: Zarvox en-US pitch 1.4 rate 0.9
  144: Google US en-US rate 0.95
  145: Google UK English Female en-GB rate 1.1 pitch 0.9
  146: Google UK English Male en-GB rate 1.1 pitch 0.9
  */
  tts.volume = 1;
  tts.rate = 1.1;
  tts.pitch = 0.9;
  tts.lang = "en-GB";

  const [prompts, assistantStatus, setAssistantStatus] = useAssistantStore((assistantStore) => [
    assistantStore.prompts,
    assistantStore.status,
    assistantStore.changeStatus,
  ]);

  tts.onend = (event) => {
    setAssistantStatus(AssistantStatus.IDLE);
    console.log(`${event.name} end.`);
  };

  // because of SpeekSynthesisBug
  let r = setInterval(() => {
    if (!speechSynthesis.speaking) {
      clearInterval(r);
    } else {
      speechSynthesis.pause();
      speechSynthesis.resume();
    }
  }, 14000);

  // Speek the message with speechSynthesis
  const speekMessage = (txt: string) => {
    tts.text = txt;
    console.log("Speaking: ");
    console.log(txt);
    window.speechSynthesis.speak(tts);
  };

  // make it react to what it's saying by growing a bit larger
  tts.onboundary = (event) => {
    ref.current.scale.x = 0.8;
    ref.current.scale.y = 0.8;
    ref.current.scale.z = 0.8;
  };

  useEffect(() => {
    if (assistantStatus === AssistantStatus.PREPARINGTOSPEEK) {
      // query for google text-to-speech or use SpeechSynthesis here
      if (prompts.at(-1)) {
        setAssistantStatus(AssistantStatus.RESPONDING);
        speekMessage(prompts.at(-1)!.content);
      }
    }
  });

  // 3D model stuff and Animation
  const colorMap = useLoader(TextureLoader, "eyes.png");
  const [goingUp, setGoingUp] = useState(true);

  useFrame((state, delta) => {
    // rotate
    if (
      assistantStatus === AssistantStatus.PROCESSING ||
      assistantStatus === AssistantStatus.PREPARINGTOSPEEK
    ) {
      ref.current.rotation.y += delta;
    }

    // gu up and down.
    if (
      assistantStatus === AssistantStatus.IDLE ||
      assistantStatus === AssistantStatus.LISTENING ||
      assistantStatus === AssistantStatus.PROCESSING ||
      assistantStatus === AssistantStatus.PREPARINGTOSPEEK
    ) {
      if (goingUp) {
        ref.current.position.y += delta / 3;
      } else {
        ref.current.position.y -= delta / 3;
      }
      if (Math.round(ref.current.position.y) === 2) {
        setGoingUp(false);
      } else if (Math.round(ref.current.position.y) === 0) {
        setGoingUp(true);
      }
    }

    if (assistantStatus === AssistantStatus.RESPONDING) {
      // no rotation while talking
      ref.current.rotation.y = 0;
      // visual response while talking -> see also "tts.onboundary" eventlistner
      if (ref.current.scale.y > 0.7) {
        ref.current.scale.x -= delta / 5;
        ref.current.scale.y -= delta / 5;
        ref.current.scale.z -= delta / 5;
      }
    }
  });

  // Used only for voice recording which ist currently not supported/implemented in this application and in the OpenAI API
  const handleClick = () => {
    click(!clicked);
    window.speechSynthesis.cancel();
    // voices.forEach((e,ind) => {if (e.lang === "en-US" ) {console.log(ind + ": " + e.name + "(" + e.lang  + ")")}})

    if (assistantStatus === AssistantStatus.IDLE) {
      setAssistantStatus(AssistantStatus.LISTENING);
    } else if (assistantStatus === AssistantStatus.LISTENING) {
      setAssistantStatus(AssistantStatus.IDLE); // or processing
    }
  };

  return (
    <mesh
      {...props}
      ref={ref}
      scale={hovered ? 0.75 : clicked ? 0.75 : 0.7}
      onClick={(event) => handleClick()}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color={getAssistantColor(assistantStatus)}
        opacity={0.19}
        map={colorMap}
      />
    </mesh>
  );
}
