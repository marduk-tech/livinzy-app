interface HomeDetails {
  communityName?: string;
  size: number;
  layout2D: string;
  oneLiner?: string;
  homeType: {
    description: string;
    homeType: string;
    _id: string;
  };
}

export interface Project {
  _id: string;
  name: string;
  homeDetails?: HomeDetails;
  previewImageUrl?: string;
  oneLiner?: string;
  designerId: {
    _id: string;
    designerName: string,
    profilePicture: string;
  };
  highlights?: {
    fixtureHighlights?: string[]
  }
  archived: boolean;
}

interface ProjectDetailsProps {
  projectData?: Project;
  basicDetailsUpdated?: any;
  skipFloorplan?: boolean;
}
