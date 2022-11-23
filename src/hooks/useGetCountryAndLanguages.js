import { useQuery } from "@tanstack/react-query";
import { languageSvc, countrySvc } from "@USupport-components-library/services";

export default function useGetCountryAndLanguages() {
  const fetchLanguagesAndCountries = async () => {
    const languages = languageSvc.getAllLanguages;
    const countries = countrySvc.getActiveCountries;

    const [languagesData, countriesData] = await Promise.all([
      languages(),
      countries(),
    ]);
    return { languages: languagesData.data, countries: countriesData.data };
  };
  const query = useQuery(
    ["all-languages-and-countries"],
    fetchLanguagesAndCountries
  );

  return query;
}

export { useGetCountryAndLanguages };
