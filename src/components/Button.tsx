import { Container, Object } from "@coconut-xr/koestlich";
import useHover from "../hooks/useHover";
import ButtonMesh from "../objects/ButtonObj";
import { ComponentPropsWithoutRef, useMemo } from "react";

interface ButtonProps extends ComponentPropsWithoutRef<typeof Container> {
  hoverAnimation?: boolean;
  ratio: number;
  radius: number;
  isPressed: boolean;
}

function Button({ hoverAnimation = true, radius, ratio, isPressed, ...props }: ButtonProps) {
  const { isHovered, hoverProps } = useHover();
  const mesh = useMemo(() => new ButtonMesh(radius, ratio), [ratio, radius]);

  return (
    <Object
      {...props}
      {...hoverProps}
      object={mesh}
      padding={0.1}
      depth={0.1}
      translateZ={isHovered && hoverAnimation ? 0.1 : 0}
      color={isPressed ? "blue" : props.backgroundColor}
    />
  );
}

export default Button;
