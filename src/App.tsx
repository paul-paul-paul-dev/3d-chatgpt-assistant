import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Recorder from "./components/Recorder";
import Assitant from "./components/Assistant";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { useEffect, useState } from "react";
import { Configuration, OpenAIApi } from "openai";
import fs from 'fs';

class CustomFormData extends FormData {
  getHeaders() {
      return {}
  }
}

const configuration = new Configuration({
  apiKey: process.env.REACT_APP_PUBLIC_OPENAI_API_KEY_WHISPER,
  formDataCtor: CustomFormData
});

const openai = new OpenAIApi(configuration);

const blobToFile = (theBlob: Blob, fileName:string): File => {
  var b: any = theBlob;
  //A Blob() is almost a File() - it's just missing the two properties below which we will add
  b.lastModifiedDate = new Date();
  b.name = fileName;

  //Cast to a File() type
  return theBlob as File;
    }


function App() {
  // React Audio Recorder
  const {
    startRecording,
    stopRecording,
    // togglePauseResume,
    recordingBlob,
    isRecording,
    // isPaused,
    // recordingTime,
  } = useAudioRecorder();

  // indicator if currently recording audio
  const [isRecorderListening, setIsRecorderListening] = useState(false);
  // Whisper Return Text
  // const [convertedText, setConvertedText] = useState<string>("");
  // Whisper loading
  const [loading, setLoading] = useState(false);
  // whisper Input data
  // const [formData, setFormData] = useState<FormData | null>(null);



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

  const handleAudio = async (blob: Blob | undefined) => {
    if (blob) {
      setLoading(true);

      const file =  blobToFile(blob, "transcirpttext") // new File([blob], "transcirpttext", {type:"audio/webm", lastModified:new Date().getTime()});
      console.log(file)

      try {
        fs.writeFileSync('../public/file.mp3', blob);
        // file written successfully
      } catch (err) {
        console.error(err);
      }
      const transcription = openai.createTranscription(fs.createReadStream('../public/file.mp3') as any, "whisper-1")


      setLoading(false);
      // setConvertedText((await transcription).data);
      return transcription;
    }
  };

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

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Recorder
          position={[-1.2, 0, 0]}
          click={setIsRecorderListening}
          clicked={isRecorderListening}
        />
        <Assitant position={[1.2, 0, 0]} isLoading={loading} />
        <OrbitControls />
      </Canvas>
      <AudioRecorder />
    </>
  );
}

export default App;
