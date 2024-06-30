// useFetchProjects.ts

import { useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

// Custom hook to fetch projects using useQuery
export const getHomeMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getHomeMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/homemeta");
      return data;
    }
  });
};

// Custom hook to fetch projects using useQuery
export const getSpaceMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getSpaceMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/spacemeta");
      return data;
    }
  });
};

// Custom hook to fetch projects using useQuery
export const getFixtureMeta = () => {
  return useQuery({
    queryKey: [queryKeys.getFixtureMeta],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/fixturemeta");
      return data;
    }
  });
};
