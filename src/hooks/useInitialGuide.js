import { useContext, useEffect, useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { clientSvc, cmsSvc, userSvc } from "@USupport-components-library/services";

import { RootContext } from "#routes";

const INITIAL_GUIDE_KEY = "getting-started-tour";
const GUEST_INITIAL_GUIDE_SESSION_KEY = "client-initial-guide-session";

/**
 * Opens the client guide once per account or after each guest login.
 */
export const useInitialGuide = ({
  isAuthenticated,
  isTmpUser,
  userId,
  language,
  clientData,
}) => {
  const queryClient = useQueryClient();
  const { selectedCountry } = useContext(RootContext);
  const country = selectedCountry?.value;
  const isUserGuidesActive = selectedCountry?.userGuidesActive === true;
  const canShowInitialGuide =
    isUserGuidesActive &&
    isAuthenticated &&
    !!userId &&
    (isTmpUser || clientData?.hasCompletedRegistration === true);
  // Both guest login flows store a new expiration value on successful login.
  const guestSession = isTmpUser ? localStorage.getItem("expires-in") : null;
  const shouldLoadInitialGuide =
    canShowInitialGuide &&
    (isTmpUser
      ? guestSession &&
        sessionStorage.getItem(GUEST_INITIAL_GUIDE_SESSION_KEY) !== guestSession
      : clientData?.hasSeenInitialGuide === false);
  const { data: initialGuide, isSuccess: isInitialGuideLoaded } = useQuery({
    queryKey: ["tutorial", "client", INITIAL_GUIDE_KEY, language],
    queryFn: () => cmsSvc.getTutorial(INITIAL_GUIDE_KEY, language, "client"),
    enabled: shouldLoadInitialGuide && Boolean(language),
    retry: 1,
  });
  const [initialGuideVideo, setInitialGuideVideo] = useState(null);
  // Keep rerenders and Strict Mode from sending a second claim.
  const initialGuideRequestedFor = useRef(null);
  const { mutate: updateClientHasSeenInitialGuide } = useMutation({
    mutationFn: async () => {
      const response = await clientSvc.updateClientHasSeenInitialGuide();
      return response.data;
    },
    onSuccess: ({ claimed }, guide) => {
      if (
        userSvc.getUserID() !== guide.userId ||
        localStorage.getItem("country") !== guide.country
      ) {
        return;
      }

      queryClient.setQueryData(["client-data"], (data) =>
        data?.clientID === guide.clientId
          ? { ...data, hasSeenInitialGuide: true }
          : data,
      );
      if (claimed) setInitialGuideVideo(guide);
    },
  });

  useEffect(() => {
    const video = initialGuide?.video;
    if (
      !shouldLoadInitialGuide ||
      !isInitialGuideLoaded ||
      initialGuide?.key !== INITIAL_GUIDE_KEY ||
      initialGuide.platform !== "client" ||
      initialGuide.locale !== language ||
      !video?.hls_url ||
      (video.status && video.status !== "ready")
    ) {
      return;
    }

    const guide = {
      userId,
      country,
      language,
      url: video.hls_url,
    };

    if (isTmpUser) {
      if (sessionStorage.getItem(GUEST_INITIAL_GUIDE_SESSION_KEY) === guestSession) {
        return;
      }
      sessionStorage.setItem(GUEST_INITIAL_GUIDE_SESSION_KEY, guestSession);
      setInitialGuideVideo(guide);
      return;
    }

    if (initialGuideRequestedFor.current === userId) return;
    initialGuideRequestedFor.current = userId;
    updateClientHasSeenInitialGuide({
      ...guide,
      clientId: clientData.clientID,
    });
  }, [
    shouldLoadInitialGuide,
    isInitialGuideLoaded,
    initialGuide,
    language,
    userId,
    country,
    isTmpUser,
    guestSession,
    clientData?.clientID,
    updateClientHasSeenInitialGuide,
  ]);

  return {
    initialGuideVideo:
      canShowInitialGuide &&
      initialGuideVideo?.userId === userId &&
      initialGuideVideo.country === country
        ? initialGuideVideo
        : null,
    closeInitialGuide: () => setInitialGuideVideo(null),
  };
};
