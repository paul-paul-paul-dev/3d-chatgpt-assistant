import { useCallback, useEffect, useRef, useState } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { Mesh, TextureLoader } from "three";
import { AssistantStatus, getAssistantColor, useAssistantStore } from "../states/AssistantState";
import { ChatCompletionRequestMessage, Configuration, OpenAIApi } from "openai";
import { useWhisper } from "@chengsokdara/use-whisper";
import { parseBuyStockAmount, parseGetCurrentPrice, parseSellStockAmount } from "../parsing/parsing";
import { getStockPrice } from "../api/finApi";
import { CommerceButtonType, useAppStore } from "../states/AppState";

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_PUBLIC_OPENAI_API_KEY,
});

delete configuration.baseOptions.headers["User-Agent"];

const openai = new OpenAIApi(configuration);

type MyAssistantProps = {
  voice?: number
};

export default function Assistant(props: JSX.IntrinsicElements["mesh"] & MyAssistantProps) {
  const ref = useRef<Mesh>(null!);
  const [hovered, hover] = useState(false);
  const [clicked, click] = useState(false);

  // useWhisper

  // Debugging
  /*
  const onTranscribe = async (blob: Blob) => {
    const base64 = await new Promise<string | ArrayBuffer | null>(
      (resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.readAsDataURL(blob)
      }
    )
    const audioUrl = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.autoplay = true;
    audio.controls = true;

    const source = document.createElement('source');
    source.src = audioUrl;
    source.type = 'audio/wav';
    audio.appendChild(source);
    document.body.appendChild(audio);

    const body = JSON.stringify({ file: base64, model: 'whisper-1' })
    const headers = { 'Content-Type': 'application/json' }
    const { default: axios } = await import('axios')
    const response = await axios.post('/api/whisper', body, {
      headers,
    })
    const { text } = await response.data
    // you must return result from your server in Transcript format
    return {
      blob,
      text,
    }
  }
  */

  const {
    recording,
    speaking,
    transcript,
    transcribing,
    startRecording,
    stopRecording,
  } = useWhisper({
    // onTranscribe,
    apiKey: process.env.REACT_APP_PUBLIC_OPENAI_API_KEY, // YOUR_OPEN_AI_TOKEN
    whisperConfig: {
      temperature: 0.1,
      language: "en",
    },
    // streaming: true,
    // timeSlice: 1_000, // 1 second
    // removeSilence: true,
    // nonStop: true, // keep recording as long as the user is speaking
    // stopTimeout: 3000, // auto stop after 5 seconds
  });

  // TTS Setup
  const tts = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  tts.voice = voices[props.voice ?? 146];
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

  const [prompts, assistantStatus, setAssistantStatus, addToPrompts] = useAssistantStore(
    (assistantStore) => [
      assistantStore.prompts,
      assistantStore.status,
      assistantStore.changeStatus,
      assistantStore.addToPrompts,
    ],
  );

  const [changeStock, changeCommerceButton] = useAppStore(
    (appStore) => [
      appStore.changeStock,
      appStore.changeCommerceButton,
    ]
  )

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

  // Speak the message with speechSynthesis
  const speakMessage = (txt: string) => {
    tts.text = txt;
    // tts.text = '<?xml version="1.1"?>\r\n<speak version="1.1" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="en-US">' +
    // '<emphasis level="strong">To be</emphasis> <break time="2000ms"/> or not to be, <break time="400ms"/> <emphasis level="moderate">that</emphasis> is the question.<break time="400ms"/> Whether tis nobler in the mind to suffer The slings and arrows of outrageous fortune,<break time=\"200ms\"/> Or to take arms against a sea of troubles And by opposing end them. </speak>'
    console.log("Speaking: ");
    console.log(txt);
    tts.voice = voices[props.voice ?? 146];
    window.speechSynthesis.speak(tts);
  };

  // make it react to what it's saying by growing a bit larger
  tts.onboundary = (event) => {
    ref.current.scale.x = 0.8;
    ref.current.scale.y = 0.8;
    ref.current.scale.z = 0.8;
  };

  const parseMessage = (message: string) => {

    const stock = parseGetCurrentPrice(message);
    const buyStockAmount = parseBuyStockAmount(message);
    const sellStockAmount = parseSellStockAmount(message);

    const dummyPrice = getStockPrice("DUMY")

    if (stock) {
      message = `The current price of ${stock.stockName} is ${dummyPrice} €`
      changeStock({companyName: stock.stockName, tickerSymbol:"AAPL", currentPrice: dummyPrice})
      changeCommerceButton(CommerceButtonType.NONE)

    } else if (buyStockAmount) {
      message = `Buying ${buyStockAmount.amount} shares of ${buyStockAmount.stockName} at a price of ${dummyPrice}`
      changeStock({companyName: buyStockAmount.stockName, tickerSymbol:"AAPL", currentPrice: dummyPrice})
      changeCommerceButton(CommerceButtonType.BUY)
    } else if (sellStockAmount) {
      message = `Selling ${sellStockAmount.amount} shares of ${sellStockAmount.stockName} at a price of ${dummyPrice}`
      changeStock({companyName: sellStockAmount.stockName, tickerSymbol:"AAPL", currentPrice: dummyPrice})
      changeCommerceButton(CommerceButtonType.SELL)
    } 
    speakMessage(message)
  }

  useEffect(() => {
    if (assistantStatus === AssistantStatus.PREPARINGTOSPEAK) {
      // query for google text-to-speech or use SpeechSynthesis here
      if (prompts.at(-1)) {
        setAssistantStatus(AssistantStatus.RESPONDING);
        parseMessage(prompts.at(-1)!.content)        
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
      assistantStatus === AssistantStatus.PREPARINGTOSPEAK
    ) {
      ref.current.rotation.y += delta;
    }

    // gu up and down.
    if (
      assistantStatus === AssistantStatus.IDLE ||
      assistantStatus === AssistantStatus.LISTENING ||
      assistantStatus === AssistantStatus.PROCESSING ||
      assistantStatus === AssistantStatus.PREPARINGTOSPEAK
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

  /*

  const getData = () => {
    // fetch("https://avalon-js-2.ts.r.appspot.com/dealCards")
    //   .then(response => response.json())
    //   .then(data => setApiResp(data));

    const data = {
      audioConfig: {
        audioEncoding: "LINEAR16",
        effectsProfileId: ["telephony-class-application"],
        pitch: 0,
        speakingRate: 1.23
      },
      input: {
        text:
          "Google Cloud Text-to-Speech enables developers to synthesize natural-sounding speech with 100+ voices, available in multiple languages and variants. It applies DeepMind’s groundbreaking research in WaveNet and Google’s powerful neural networks to deliver the highest fidelity possible. As an easy-to-use API, you can create lifelike interactions with your users, across many applications and devices."
      },
      voice: {
        languageCode: "en-GB",
        name: "en-GB-Neural2-C"
      }
    };

    fetch(
      "https://us-central1-texttospeech.googleapis.com/v1beta1/text:synthesize",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + process.env.REACT_APP_PUBLIC_GOOGLE_API_KEY
        },
        body: JSON.stringify(data)
      }
    )
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

*/

  // Used only for voice recording which ist currently not supported/implemented in this application and in the OpenAI API
  const handleClick = () => {
    click(!clicked);
    window.speechSynthesis.cancel();
    // voices.forEach((e,ind) => {if (e.lang === "en-US" ) {console.log(ind + ": " + e.name + "(" + e.lang  + ")")}})

    if (assistantStatus === AssistantStatus.IDLE) {
      // speakMessage("")
      startRecording();
    } else if (assistantStatus === AssistantStatus.LISTENING) {
      stopRecording();
    }
  };

  useEffect(() => {
    console.log(transcript.text);
    window.speechSynthesis.cancel();

    if (transcript.text) {
      addToPrompts({ role: "user", content: transcript.text });
    } else {
      console.log("ERROR: Transcript was undefined");
    }
  }, [transcript, addToPrompts]);

  useEffect(() => {
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

        // Debugging
        /*
        const myPromise = new Promise<ChatCompletionRequestMessage>((resolve, reject) => {
          setTimeout(() => {
            resolve({content: "TestString", role: "assistant"});
          }, 300);
        });
  
        return await myPromise;
        */

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

    if (prompts.length % 2 === 0) {
      setAssistantStatus(AssistantStatus.PROCESSING);
      sendRequest()
        .then((response) => {
          addToPrompts(response!);
        })
        .then(() => setAssistantStatus(AssistantStatus.PREPARINGTOSPEAK));
    }
  }, [addToPrompts, setAssistantStatus, prompts]);

  useEffect(() => {
    console.log("Transcribing: " + transcribing); // the process of sending the file to openAI and recieving it back
  }, [transcribing]);

  useEffect(() => {
    console.log("Recording: " + recording); // the while time the Assistant is recording
  }, [recording]);

  useEffect(() => {
    console.log("Speaking: " + speaking); // when the User is speaking
  }, [speaking]);

  useEffect(() => {
    setAssistantStatus(
      recording
        ? AssistantStatus.LISTENING
        : transcribing
        ? AssistantStatus.PROCESSING
        : AssistantStatus.IDLE,
    );
  }, [recording, transcribing, setAssistantStatus]);

  return (
    <mesh
      {...props}
      ref={ref}
      scale={hovered ? 0.75 : clicked ? 0.75 : 0.7}
      onClick={(event) => handleClick()}
      onPointerOver={(event) => hover(true)}
      onPointerOut={(event) => hover(false)}
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial
        color={getAssistantColor(assistantStatus)}
        opacity={0.19}
        map={colorMap}
      />
    </mesh>
  );
}
