import { Project } from "./Project";

export interface User {
  _id: string;
  mobile: string;
  name?: string;
  email?: string;
  favoriteProjects?: string[];
  createdAt: Date;
  updatedAt: Date;
}
