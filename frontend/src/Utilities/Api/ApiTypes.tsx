import { Gig, Setting } from "../../Types";


export type ApiConfig = {
  apiUrl: string;
  baseUrl: string;
  useApi: boolean;
};

export type ApiResponse = {
  message: string;
  status: number;
};

export type EventsApiResponse = ApiResponse & {
  data?: Gig;
};

export type AllEventsApiResponse = ApiResponse & {
  data?: Array<Gig>;
};

export type SettingsApiResponse = ApiResponse & {
  data?: Array<Setting>
}

export type SettingApiResponse = ApiResponse & {
  data?: Setting
}