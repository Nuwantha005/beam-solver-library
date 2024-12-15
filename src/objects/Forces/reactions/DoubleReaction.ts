import BaseReaction from "./BaseReaction";

class DoubleReaction extends BaseReaction {
  constructor(magnitude: number, direction: number, x: number, y: number) {
    super(magnitude, direction, x, y);
  }

  set Moment(value: any) {
    throw new Error("DoubleReaction does not support moments.");
  }

  get Moment() {
    throw new Error("DoubleReaction does not support moments.");
  }

  // Override any methods if necessary to ensure no momentum is included
  // ...existing code...
}

export default DoubleReaction;
