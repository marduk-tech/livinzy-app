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
  fixtures: string[];
  cost: number;
  projectId: string;
}
