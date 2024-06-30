export interface HomeMeta {
  _id: string;
  homeType: string;
  description: string;
}

export interface SpaceMeta {
  _id: string;
  spaceType: string;
  description: string;
  icon?: string;
}

export interface FixtureMeta {
  _id?: string;
  fixtureType: string;
  description?: string;
  addedByDesignerId?: string;
}
