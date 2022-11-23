import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { providerSvc } from "@USupport-components-library/services";

/**
 * Reuseable hook to get and transform the provider data in a desired format
 */
export default function useGetProviderData(id = null) {
  //   const queryClient = useQueryClient();
  const [providersData, setProvidersData] = useState();
  const fetchProvidersData = async () => {
    let data;
    if (id) {
      await new Promise((resolve) => resolve());
      // data = await providerSvc.getProviderData(id);
      data = {
        provider_detail_id: "bdf2f7d6-30eb-49fe-93a4-b7a0b25d62c3",
        name: "Vasilen",
        patronym: "",
        surname: "Tsvetkov",
        nickname: "",
        email: "vasilen@7digit.io",
        phone_prefix: "+359",
        phone: "898576778",
        image: "default",
        specializations: ["coach", "psychotherapist"],
        address: "11 Rusholme Place",
        education: ["Education 1", "Education 2"],
        sex: "male",
        consultation_price: 60,
        description: "Lorem ipsum dolor sit amet",
        languages: [
          {
            language_id: "976cc9d4-b4d4-4389-8ed9-ab712d6992af",
            name: "Uzbek",
            alpha2: "uz",
          },
          {
            language_id: "d6112f77-bfd8-4d63-b20c-31fd55e8c557",
            name: "Ukrainian",
            alpha2: "uk",
          },
        ],
        work_with: [
          {
            work_with_id: "b6d57cee-5f13-4556-b53f-217a5138f5a8",
            topic: "addiction",
          },
          {
            work_with_id: "06bbc2af-880d-4f66-b2ac-9b0a573eebb7",
            topic: "stress",
          },
        ],
      };
    } else {
      const response = await providerSvc.getProviderData();
      data = response.data;
    }

    const formattedData = {
      providerDetailId: data.provider_detail_id || "",
      name: data.name || "",
      patronym: data.patronym || "",
      surname: data.surname || "",
      nickname: data.nickname || "",
      email: data.email || "",
      phonePrefix: data.phone_prefix || "",
      phone: data.phone || "",
      image: data.image || "default",
      specializations: data.specializations || [],
      address: data.address || "",
      education: data.education || [],
      sex: data.sex || "",
      consultationPrice: data.consultation_price || 0,
      description: data.description || "",
      languages: data.languages || [],
      workWith: data.work_with || [],
    };
    return formattedData;
  };

  const providersDataQuery = useQuery(["provider-data"], fetchProvidersData, {
    onSuccess: (data) => {
      const dataCopy = JSON.parse(JSON.stringify(data));
      setProvidersData({ ...dataCopy });
    },
    onError: (err) => console.log(err, "err"),
    notifyOnChangeProps: ["data"],
  });

  return [providersDataQuery, providersData, setProvidersData];
}

export { useGetProviderData };
