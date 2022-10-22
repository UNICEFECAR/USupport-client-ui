import React from "react";
import { SOSCenter as SOSCenterBlock } from "../../blocks/SOSCenter/SOSCenter";
import { Page } from "../../blocks/Page/Page";

/**
 * SOSCenter page.
 *
 * @returns {JSX.Element}
 */
export const SOSCenter = ({ contacts }) => {
  return (
    <Page>
      <SOSCenterBlock contacts={contacts} />
    </Page>
  );
};
