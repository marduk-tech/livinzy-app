import { Space } from "./Space";

export interface Slide {
  _id?: string;
  url: string;
  spaces?: string[];
  fixtures?: string[];
}

interface SlideDetailsProps {
  slide: Slide;
}
