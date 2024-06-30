import { useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";
import { Slide } from "../interfaces/Slide";

// Custom hook to fetch projects using useQuery
export const useFetchSlidesByProject = (projectId: string) => {
  return useQuery<Slide[], Error>({
    queryKey: [queryKeys.getSlides, projectId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/slides/project/${projectId}`
      );
      return data;
    }
  });
};
