import { useMemo, useState } from "react";

function useHover() {
  const [isHovered, setIsHovered] = useState(false);

  const hoverProps = useMemo(
    () => ({
      onPointerEnter: () => setIsHovered(true),
      onPointerLeave: () => setIsHovered(false),
    }),
    [],
  );

  return { isHovered, setIsHovered, hoverProps };
}

export default useHover;
