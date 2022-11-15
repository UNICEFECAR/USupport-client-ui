import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { clientSvc } from "@USupport-components-library/services";

const placeholderData = [];
for (let i = 0; i < 10; i++) {
  placeholderData.push({
    id: i,
    name: "John ",
    patronym: i < 5 ? "Patronym" : "",
    surname: "Doe " + i,
    image: "default",
    phone: "+359 888 888 888",
    education: "Some text describing the providers education",
    sex: i % 2 === 0 ? "male" : "female",
    price: 10 * (i + 1),
    languages: ["en", "bg"],
    types: [
      "psychologist",
      "psychotherapist",
      i % 2 === 0 ? "coach" : null,
    ].filter((x) => x !== null),
    earliestFreeSpot: "",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Varius euismod.",
    worksWith: ["children", "male", i % 2 === 0 ? "female" : ""],
  });
}

/**
 * Reuseable hook to get and transform the client data in a desired format
 */
export default function useGetProvidersData() {
  //   const queryClient = useQueryClient();
  const [providersData, setProvidersData] = useState();
  const fetchProvidersData = async () => {
    await new Promise((resolve) => resolve());
    return placeholderData;
  };

  const providersDataQuery = useQuery(["client-data"], fetchProvidersData, {
    onSuccess: (data) => {
      const dataCopy = JSON.parse(JSON.stringify(data));
      setProvidersData([...dataCopy]);
    },
    onError: (err) => console.log(err, "err"),
    notifyOnChangeProps: ["data"],
  });

  return [providersDataQuery, providersData, setProvidersData];
}

export { useGetProvidersData };
