// useFetchProjects.ts

import { useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";
import { Project } from "../interfaces/Project";

// Custom hook to fetch projects using useQuery
export const useFetchProjects = () => {
  return useQuery<Project[], Error>({
    queryKey: [queryKeys.getProjects],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/projects");
      return data;
    }
  });
};

// Custom hook to fetch project by id
export const useFetchProject = (id: string) => {
  return useQuery<Project, Error>({
    queryKey: [queryKeys.getProject, id],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(`/projects/${id}`);
      return data;
    }
  });
};
