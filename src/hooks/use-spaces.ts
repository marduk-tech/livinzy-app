import { useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

// Custom hook to fetch projects using useQuery
export const useFetchSpacesByProject = (projectId: string) => {
  return useQuery({
    queryKey: [queryKeys.getSpaces, projectId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/spaces/project/${projectId}`
      );
      return data;
    }
  });
};
