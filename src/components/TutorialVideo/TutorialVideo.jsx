import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { TutorialVideo as LibraryTutorialVideo } from "@USupport-components-library/src";

// Bridge the UI's query cache into the library even when the bundle contains
// separate React Query contexts for the application and components library.
export const TutorialVideo = (props) => {
  const queryClient = useQueryClient();
  return <LibraryTutorialVideo {...props} queryClient={queryClient} />;
};
