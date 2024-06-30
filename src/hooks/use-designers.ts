import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeys } from "../libs/react-query/constants";
import { axiosApiInstance } from "../libs/axios-api-Instance";

// Define interface for Designer
interface Designer {
  id?: string;
  designerName: string;
  websiteUrl: string;
  profileStatus: string;
  mobile: string;
}

// Custom hook to fetch list of designers
export const useGetDesigners = () => {
  return useQuery<Designer[], Error>({
    queryKey: [queryKeys.getDesigners],
    queryFn: async () => {
      const { data } = await axiosApiInstance.get("/designers");
      return data;
    }
  });
};

// Custom hook to save designer data
export const useSaveDesigner = () => {
  return useMutation({
    mutationFn: async (designerData: Designer) => {
      const response = await axiosApiInstance.post("/designers", designerData);
      return response.data;
    }
  });
};
