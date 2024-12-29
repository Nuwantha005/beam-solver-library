import BaseForce from "./BaseFroce";

class Force2D extends BaseForce {
  constructor(magnitude: number, direction: number, x: number) {
    super(magnitude, direction, x, 0);
  }
}

export default Force2D;
