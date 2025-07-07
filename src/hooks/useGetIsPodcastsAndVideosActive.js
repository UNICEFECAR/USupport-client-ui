import { useQueryClient } from "@tanstack/react-query";

export const useGetIsPodcastsAndVideosActive = () => {
  const queryClient = useQueryClient();
  const countries = queryClient.getQueryData(["countries"]);
  const currentCountry = localStorage.getItem("country");

  let isPodcastsActive = "loading";
  let isVideosActive = "loading";

  if (countries) {
    isPodcastsActive = countries?.find(
      (country) => country.value === currentCountry
    )?.podcastsActive;

    isVideosActive = countries?.find(
      (country) => country.value === currentCountry
    )?.videosActive;
  }

  return { isPodcastsActive, isVideosActive };
};
