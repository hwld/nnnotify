import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../lib/apiClient";

export const useUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      return (await apiClient.users.$get()).json();
    },
  });
};
