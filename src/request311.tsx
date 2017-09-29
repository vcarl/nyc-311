import axios, { AxiosResponse } from "axios";
import { pick, filter, map, prop, compose } from "ramda";

export interface CityRequest {
  unique_key: string;
  address_type: string;
  agency: string;
  agency_name: string;
  borough: string;
  city: string;
  community_board: string;
  complaint_type: string;
  created_date: string;
  descriptor: string;
  incident_zip: string;
  latitude: string;
  location: {
    coordinates: [string, string];
    type: string;
  };
  longitude: string;
  resolution_action_updated_date: string;
  resolution_description: string;
  status: string;
}

const attributes = [
  "unique_key",
  "address_type",
  "agency",
  "agency_name",
  "borough",
  "city",
  "community_board",
  "complaint_type",
  "created_date",
  "descriptor",
  "incident_zip",
  "latitude",
  "location",
  "longitude",
  "resolution_action_updated_date",
  "resolution_description",
  "status"
];

function requestExists(x: CityRequest): boolean {
  return x.location !== undefined;
}

export default function request311(): Promise<CityRequest[]> {
  return axios
    .get("https://data.cityofnewyork.us/resource/fhrw-4uyv.json")
    .then(
      compose<AxiosResponse, CityRequest[], CityRequest[], CityRequest[]>(
        filter(requestExists),
        map<CityRequest, CityRequest>(pick(attributes)),
        prop<CityRequest>("data")
      )
    );
}
