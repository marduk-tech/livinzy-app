import { useMutation, useQuery } from "@tanstack/react-query";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { queryKeys } from "../libs/react-query/constants";

// Custom hook to fetch projects using useQuery
export const useFetchFixturesByProject = (projectId: string) => {
  return useQuery({
    queryKey: [queryKeys.getFixtures, projectId],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get(
        `/fixtures/project/${projectId}`
      );
      return data;
    },
  });
};

export const useGenerateComponentInfo = () => {
  return useMutation({
    mutationFn: async (fixtureId: string) => {
      const response = await axiosApiInstance.post("/ai/getcomponentinfo", {
        fixtureId: fixtureId,
      });

      return response.data;
    },
  });
};
