import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { providerSvc } from "@USupport-components-library/services";

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
    const { data } = await providerSvc.getAllProviders();
    const formattedData = [];
    for (let i = 0; i < data.length; i++) {
      const providerData = data[i];
      const formattedProvider = {
        providerDetailId: providerData.provider_detail_id || "",
        name: providerData.name || "",
        patronym: providerData.patronym || "",
        surname: providerData.surname || "",
        nickname: providerData.nickname || "",
        email: providerData.email || "",
        phonePrefix: providerData.phone_prefix || "",
        phone: providerData.phone || "",
        image: providerData.image || "default",
        specializations: providerData.specializations || [],
        education: providerData.education || [],
        sex: providerData.sex || "",
        consultationPrice: providerData.consultation_price || 0,
        description: providerData.description || "",
        languages: providerData.languages || [],
        workWith: providerData.work_with || [],
        totalConsultations: providerData.total_consultations || 0,
        earliestAvailableSlot: providerData.earliest_available_slot || "",
      };
      formattedData.push(formattedProvider);
    }
    return formattedData;
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
