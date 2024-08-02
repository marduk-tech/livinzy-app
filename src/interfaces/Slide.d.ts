import { BoundingBox, FixtureImageBounds } from "./Fixture";
import { Space } from "./Space";

export interface Slide {
  _id?: string;
  url: string;
  spaces?: string[];
  fixtures?: string[];
  fixturesMapping?: FixtureImageBounds[];
}

interface SlideDetailsProps {
  slide: Slide;
}
