import React from "react";
import { Page, MascotHeaderQAA } from "#blocks";

import "./q&a.scss";

/**
 * Q&A
 *
 * Q&A page
 *
 * @returns {JSX.Element}
 */
export const QAA = () => {
  return (
    <Page classes="page__q&a" showGoBackArrow={false}>
      <MascotHeaderQAA />
    </Page>
  );
};
