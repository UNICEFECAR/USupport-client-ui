import { useQuery } from "@tanstack/react-query";
import { clientSvc } from "@USupport-components-library/services";

export function useGetMoodTrackEntries(
  limit = 6,
  pageNum = 0,
  onSuccess,
  enabled
) {
  const getMoodTrackEntries = async () => {
    const { data } = await clientSvc.getMoodTrackEntries(limit, pageNum);

    const curEntries = data.currentEntries.map((moodTrack) => {
      const date = new Date(moodTrack.time);
      return {
        ...moodTrack,
        time: date,
      };
    });

    const prevEntries = data.previousEntries.map((moodTrack) => {
      const date = new Date(moodTrack.time);
      return {
        ...moodTrack,
        time: date,
      };
    });

    return { hasMore: data.hasMore, curEntries, prevEntries };
  };

  const getMoodTrackEntriesQuery = useQuery(
    ["getMoodTrackEntries", limit, pageNum],
    getMoodTrackEntries,
    { onSuccess: onSuccess, enabled: !!enabled }
  );

  return getMoodTrackEntriesQuery;
}
