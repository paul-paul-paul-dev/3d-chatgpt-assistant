import { Container, Object } from "@coconut-xr/koestlich";
import useHover from "../hooks/useHover";
import CardMesh from "../objects/Card";
import { ComponentPropsWithoutRef, useMemo } from "react";

interface CardProps extends ComponentPropsWithoutRef<typeof Container> {
  hoverAnimation?: boolean;
  ratio: number;
  radius: number;
  isPressed: boolean;
}

function Card({ hoverAnimation = true, radius, ratio, isPressed, ...props }: CardProps) {
  const { isHovered, hoverProps } = useHover();

  const mesh = useMemo(() => new CardMesh(radius, ratio), [ratio, radius]);

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

export default Card;
