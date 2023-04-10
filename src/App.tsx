import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Assitant from "./components/Assistant";
import { useState } from "react";
import TextInput from "./components/TextInput";
import { inputCanvasProps } from "@coconut-xr/input";
import { ChatCompletionRequestMessage } from "openai";

function App() {
  // React Audio Recorder
  /*
  const {
    startRecording,
    stopRecording,
    // togglePauseResume,
    recordingBlob,
    isRecording,
    // isPaused,
    // recordingTime,
  } = useAudioRecorder();
*/

  // indicator if currently recording audio
  /* const [isRecorderListening, setIsRecorderListening] = useState(false); */
  // Whisper Return Text
  // const [convertedText, setConvertedText] = useState<string>("");
  // whisper Input data
  // const [formData, setFormData] = useState<FormData | null>(null);

  // Create display:none audio to autoplay the recorded result
  /*
  const createAudio = (blob: Blob | undefined):  void => {
    if (blob) {
      console.log("Blob_Present");
      const url = URL.createObjectURL(blob);
      const audio = document.createElement("audio");
      audio.src = url;
      audio.controls = false;
      document.body.appendChild(audio);
      audio.play();

      
    } else {
      console.log("No_Blob_Present");
    }
  };
*/

  // create Whisper Transcription with blob
  // This is not working because the API doesn't suppurt blob files to be passed to it
  /*
GH Issue: https://github.com/openai/openai-node/issues/77 /// https://github.com/openai/openai-node/pull/78
*/
  /*
  const filePath = './audio.m4a';
  // ok
  const readStream = fs.createReadStream(filePath);
  // status 400
  const buffer = fs.readFileSync(filePath);
  // status 400
  const base64 = buffer.toString('base64');
  // TypeError: source.on is not a function (FormData does not implement Blob, https://github.com/form-data/form-data/issues/529 )
  const blob = new Blob([toArrayBuffer(buffer)]);

  await openai.createTranscription(
    readStream, // buffer, base64 with mime-type, or blob
    'whisper-1',
  );
*/
  /* 
  const handleAudio = async (blob: Blob | undefined) => {
    if (blob) {
      setLoading(true);

      const f = blobToFile(blob, "name")
      const transcription = openai.createTranscription(f, "whisper-1")
      setLoading(false);
      // setConvertedText((await transcription).data);
      return transcription;
    }
  };
*/

  // ==== UseEffect for Recording Audio ====
  /*
  useEffect(() => {
    if (isRecording && !isRecorderListening) {
      stopRecording();
      console.log("Stopped");
    }

    if (isRecorderListening && !isRecording) {
      startRecording();
      console.log("Started");
    }
  }, [isRecorderListening, isRecording, stopRecording, startRecording]);

  useEffect(() => {
  createAudio(recordingBlob);
    handleAudio(recordingBlob)
    .then((data) => console.log(data))
    .catch(console.log)
  }, [recordingBlob]);
*/

  return (
    <>
      <Canvas {...inputCanvasProps}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {/* <Recorder
          
          click={setIsRecorderListening}
          clicked={isRecorderListening}
        /> */}
        <TextInput />
        <Assitant position={[0, 1, 0]} />
        <OrbitControls enableRotate={false} />
      </Canvas>
      {/* <AudioRecorder /> */}
    </>
  );
}

export default App;
