import { useState } from "react";

import { applyKeepMeSignedInOnLogin } from "@USupport-components-library/utils";

/**
 * Shared keep-me-signed-in toggle state for auth surfaces.
 */
export function useKeepMeSignedIn() {
  const [keepMeSignedIn, setKeepMeSignedIn] = useState(false);
  const [isKeepMeSignedInSheetOpen, setIsKeepMeSignedInSheetOpen] =
    useState(false);
  const [isKeepMeSignedInPending, setIsKeepMeSignedInPending] = useState(false);

  const handleKeepMeSignedInToggle = (nextValue) => {
    if (nextValue) {
      setIsKeepMeSignedInPending(true);
      setIsKeepMeSignedInSheetOpen(true);
      return;
    }
    setKeepMeSignedIn(false);
  };

  const handleKeepMeSignedInSheetCancel = () => {
    setIsKeepMeSignedInSheetOpen(false);
    setIsKeepMeSignedInPending(false);
  };

  const handleKeepMeSignedInSheetContinue = () => {
    setIsKeepMeSignedInSheetOpen(false);
    setIsKeepMeSignedInPending(false);
    setKeepMeSignedIn(true);
  };

  const applyKeepMeSignedIn = () => {
    applyKeepMeSignedInOnLogin(keepMeSignedIn);
  };

  return {
    keepMeSignedIn,
    keepMeSignedInToggleValue: keepMeSignedIn || isKeepMeSignedInPending,
    isKeepMeSignedInSheetOpen,
    handleKeepMeSignedInToggle,
    handleKeepMeSignedInSheetCancel,
    handleKeepMeSignedInSheetContinue,
    openKeepMeSignedInSheet: () => setIsKeepMeSignedInSheetOpen(true),
    applyKeepMeSignedIn,
  };
}
