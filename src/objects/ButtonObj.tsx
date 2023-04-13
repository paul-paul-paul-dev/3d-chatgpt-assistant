import { ExtrudeGeometry, Mesh, MeshPhongMaterial, Shape } from "three";

class ButtonGeometry extends ExtrudeGeometry {
  constructor(width: number, height: number, radius: number) {
    const roundedRectShape = new Shape();
    roundedRectShape.moveTo(0, radius);
    roundedRectShape.lineTo(0, height - radius);
    roundedRectShape.quadraticCurveTo(0, height, radius, height);
    roundedRectShape.lineTo(width - radius, height);
    roundedRectShape.quadraticCurveTo(width, height, width, height - radius);
    roundedRectShape.lineTo(width, radius);
    roundedRectShape.quadraticCurveTo(width, 0, width - radius, 0);
    roundedRectShape.lineTo(radius, 0);
    roundedRectShape.quadraticCurveTo(0, 0, 0, radius);
    super(roundedRectShape, { depth: 1, bevelEnabled: false });
  }
}

class ButtonMesh extends Mesh {
  constructor(radius: number, ratio: number) {
    const geometry = new ButtonGeometry(100 * ratio, 100, radius);
    const material = new MeshPhongMaterial({
      toneMapped: false,
      transparent: true,
    });
    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = true;
  }
}

export default ButtonMesh;
