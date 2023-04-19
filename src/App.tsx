import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Assitant from "./components/Assistant";
import TextInput from "./components/TextInput";
import { inputCanvasProps } from "@coconut-xr/input";

function App() {
  return (
    <>
      <Canvas {...inputCanvasProps}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        {/* <TextInput /> */}
        <Assitant position={[0, 1, 0]} />
        <OrbitControls enableRotate={false} />
      </Canvas>
    </>
  );
}

export default App;
