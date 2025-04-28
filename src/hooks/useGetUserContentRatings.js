import { useQuery } from "@tanstack/react-query";
import { userSvc } from "@USupport-components-library/services";

export const useGetUserContentRatings = () => {
  const getUserContentRatings = async () => {
    const response = await userSvc.getUserContentRatings();
    const { data } = response;
    return data;
  };

  return useQuery({
    queryKey: ["userContentRatings"],
    queryFn: getUserContentRatings,
  });
};
