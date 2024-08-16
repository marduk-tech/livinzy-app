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
  components: FixtureComponent[];
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

interface BenefitUsage {
  title: string;
  description: string;
}

interface BrandDescription {
  title: string;
  description: string;
}

interface ComponentInfo {
  benefitUsages: BenefitUsage[];
  brandDescription: BrandDescription;
}

interface FixtureComponent {
  _id: string;
  commonName?: string;
  originalName?: string;
  workType?: string;
  brand?: string;
  oneLiner?: string;
  material?: string;
  cost?: number;
  genDetails?: ComponentInfo;
}
