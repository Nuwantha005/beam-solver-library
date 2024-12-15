import { BaseSupport, supportType } from "./BaseSupport";

export class PinnedSupport extends BaseSupport {
  constructor(location: number) {
    super(location, supportType.pinnedSupport);
  }
}

export default PinnedSupport;
