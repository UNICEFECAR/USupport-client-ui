import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { clientSvc } from "@USupport-components-library/services";

/**
 * Reuseable hook to get and transform the client data in a desired format
 */
export default function useGetClientData() {
  const queryClient = useQueryClient();
  const [clientData, setClientData] = useState();
  const fetchClientData = async () => {
    const res = await clientSvc.getClientData();

    const data = {
      clientID: res.data.client_detail_id,
      accessToken: res.data.access_token,
      email: res.data.email || "",
      name: res.data.name || "",
      surname: res.data.surname || "",
      nickname: res.data.nickname || "",
      sex: res.data.sex || "",
      yearOfBirth: res.data.year_of_birth || "",
      image: res.data.image,
      livingPlace: res.data.living_place || "",
      dataProcessing: res.data.data_processing,
    };
    queryClient.setQueryData(["client-image"], data.image);
    return data;
  };

  const clientDataQuery = useQuery(["client-data"], fetchClientData, {
    onSuccess: (data) => {
      const dataCopy = JSON.parse(JSON.stringify(data));
      setClientData({ ...dataCopy });
    },
    initialData: {
      clientID: "",
      accessToken: "",
      email: "",
      name: "",
      surname: "",
      nickname: "",
      sex: "",
      yearOfBirth: "",
      image: "default",
      livingPlace: "",
      dataProcessing: "",
    },
  });

  const update = (data) => {
    queryClient.setQueryData(["client-data"], data);
  };

  return [clientDataQuery, clientData, update];
}

export { useGetClientData };
