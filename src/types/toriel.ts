type continent =
  | "north_america"
  | "south_america"
  | "europe"
  | "asia"
  | "africa"
  | "australia"
  | "antarctica";

export enum Continent {
  north_america = "North America",
  south_america = "South America",
  europe = "Europe",
  asia = "Asia",
  africa = "Africa",
  australia = "Australia",
  antarctica = "Antarctica",
}

export type torielReq = {
  userId: string;
  continent: continent;
  joinReason: string;
};
