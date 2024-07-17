import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { User } from "../interfaces/User";
import { axiosApiInstance } from "../libs/axios-api-Instance";
import { LocalStorageKeys } from "../libs/constants";
import { queryKeys } from "../libs/react-query/constants";
import { useAuth } from "./use-auth";

export function useUser() {
  const { logout } = useAuth();

  const getUser = async (): Promise<User> => {
    const userItem = localStorage.getItem(LocalStorageKeys.user);
    const user = userItem ? JSON.parse(userItem) : null;

    if (!user) {
      throw new Error("User not found in local storage");
    }

    const userInfo = (await axiosApiInstance
      .get(`/auth/myinfo/${user._id}`, {})
      .then((data) => {
        return data.data;
      })) as User;

    return userInfo;
  };

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: [queryKeys.user],
    queryFn: getUser,
    retry: 2,
  });

  useEffect(() => {
    if (isError) {
      logout.mutate();
    }
  }, [isError, error]);

  //mutations
  const useUpdateUser = () => {
    return useMutation({
      mutationFn: async ({ id, data }: { id: string; data: Partial<User> }) => {
        const response = await axiosApiInstance.put(`/users/${id}`, data);
        return response.data;
      },
    });
  };

  return { user: data, isLoading, isError, error, refetch, useUpdateUser };
}
