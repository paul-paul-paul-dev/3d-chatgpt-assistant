import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Mesh } from "three";

type MyRecorderProps = {
  clicked: boolean;
  click: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function Recorder(
  props: JSX.IntrinsicElements["mesh"] & MyRecorderProps
) {
  // This reference gives us direct access to the THREE.Mesh object
  const ref = useRef<Mesh>(null!);
  // Hold state for hovered and clicked events
  const [hovered, hover] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame((state, delta) => (ref.current.rotation.x += delta));
  // Return the view, these are regular Threejs elements expressed in JSX

  return (
    <>
      <mesh
        {...props}
        ref={ref}
        scale={props.clicked ? 1.5 : 1}
        onClick={(event) => props.click(!props.clicked)}
        onPointerOver={(event) => hover(true)}
        onPointerOut={(event) => hover(false)}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? "hotpink" : "orange"} />
      </mesh>
    </>
  );
}
