import BaseReaction from "./BaseReaction";
import Moment from "../Moment";

class SimpleReaction extends BaseReaction {
  constructor(magnitude: number, direction: "up" | "down", x: number) {
    const angle = direction === "up" ? 90 : -90;
    super(magnitude, angle, x, 0);
  }

  // Override setMoment to prevent setting a moment
  setMoment(): void {
    throw new Error("SimpleReaction does not support moments.");
  }

  // Override getMoment to prevent getting a moment
  getMoment(): Moment {
    throw new Error("SimpleReaction does not support moments.");
  }

  // Additional methods specific to SimpleReaction can be added here
}

export default SimpleReaction;
