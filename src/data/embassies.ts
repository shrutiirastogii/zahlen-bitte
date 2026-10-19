export type Embassy = {
  country: string;
  type: "Embassy";
  address: string;
  city: string;
  coordinates: [number, number] | null;
  source: string;
  sourceUrl: string;
  flagCode: string;
  verified: boolean;
};
