import { BoxGeometry, Mesh, MeshPhongMaterial } from "three";

class RectMesh extends Mesh {
  constructor() {
    const geometry = new BoxGeometry();
    const material = new MeshPhongMaterial({
      toneMapped: false,
      transparent: true
    });
    super(geometry, material);
    this.castShadow = true;
    this.receiveShadow = true;
  }
}

export default RectMesh;
