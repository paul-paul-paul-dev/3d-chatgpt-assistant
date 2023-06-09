import { Container, Object } from "@coconut-xr/koestlich";
import useHover from "../hooks/useHover";
import { ComponentPropsWithoutRef, useMemo } from "react";
import CardMesh from "./CardMesh";
import { ColorRepresentation } from "three";

interface CardProps extends ComponentPropsWithoutRef<typeof Container> {
  hoverAnimation?: boolean;
  ratio: number;
  radius: number;
  hoverHeight?: number;
  padding?: number;
  color?: ColorRepresentation
}

function Card({ hoverAnimation = true,hoverHeight = 0.1, radius, padding = 0.1, ratio, color = "white", ...props }: CardProps) {
  const { isHovered, hoverProps } = useHover();

  const mesh = useMemo(() => new CardMesh(radius, ratio), [ratio, radius]);

  return (
    <Object
      {...props}
      {...hoverProps}
      object={mesh}
      padding={padding}
      depth={0.1}
      translateZ={isHovered && hoverAnimation ? hoverHeight : 0}
      color={color}
    
    />
  );
}

export default Card;