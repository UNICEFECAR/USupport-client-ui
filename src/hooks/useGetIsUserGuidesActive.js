import { useContext } from "react";

import { RootContext } from "#routes";

export const useGetIsUserGuidesActive = () => {
  const { selectedCountry } = useContext(RootContext);
  return selectedCountry?.userGuidesActive === true;
};
