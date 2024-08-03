import { Fixture } from "./Fixture";
import { Slide } from "./Slide";

export interface Space {
  _id?: string;
  size: {
    l: number;
    w: number;
    h: number;
  };
  name: string;
  oneLiner: string;
  spaceType: {
    spaceType: string;
    icon: string;
    _id: string;
  };
  fixtures: Fixture[];
  slides: Slide[];
  cost: number;
  projectId: string;
}
