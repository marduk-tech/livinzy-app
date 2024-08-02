export interface BoundingBox {
  startPoint: { x: number; y: number };
  endPoint: { x: number; y: number };
  imageSize: { width: number; height: number };
}

export interface Fixture {
  _id?: string;
  fixtureType?: {
    fixtureType: string;
    description: string;
    _id: string;
  };
  cost?: number;
  designName?: string;
  description?: string;
  projectId?: string;
  imageBounds?: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    imageSize: { width: number; height: number };
  };
  components: any[];
}

export interface FixtureFormData {
  _id?: string;
  fixtureType?: string;
  cost?: Number;
  designName?: string;
  description?: string;
  projectId?: string;
  imageBounds?: {
    startPoint: { x: number; y: number };
    endPoint: { x: number; y: number };
    imageSize: { width: number; height: number };
  };
}

export interface FixtureImageBounds {
  fixtureId: string;
  boundingBox: BoundingBox;
}
