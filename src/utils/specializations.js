export const PEER_SUPPORT = "peer_support";

export const BASE_PROVIDER_TYPES = [
  "psychologist",
  "psychotherapist",
  "psychiatrist",
];

// Peer support is not a filter option: in Armenia it has its own tab on the
// provider list.
export const getProviderTypeFilterOptions = () => [...BASE_PROVIDER_TYPES];
