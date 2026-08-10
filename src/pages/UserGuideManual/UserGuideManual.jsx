import React, { useEffect } from "react";

const GIT_BOOK_URL = import.meta.env.VITE_GIT_BOOK_URL;
const CLIENT_USER_GUIDE_HREF = GIT_BOOK_URL
  ? `${GIT_BOOK_URL}/ui-usage-manuals/client`
  : null;

/**
 * UserGuideManual
 *
 * Redirects to the GitBook client user guide.
 *
 * @returns {null}
 */
export const UserGuideManual = () => {
  useEffect(() => {
    if (!CLIENT_USER_GUIDE_HREF) return;

    window.location.replace(CLIENT_USER_GUIDE_HREF);
  }, []);

  return null;
};
