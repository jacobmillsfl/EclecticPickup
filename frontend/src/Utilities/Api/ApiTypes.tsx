import { Gig, Setting } from "../../Types";


export type ApiConfig = {
  apiUrl: string;
  baseUrl: string;
  useApi: boolean;
};

export type ApiResponse = {
  msg: string;
  status: number;
};

export type ApiResponseWithData<T> = ApiResponse & {
  data?: T;
};

export interface ICrudApi<T> {
  create: (data: Omit<T, "id">) => Promise<ApiResponseWithData<T>>,
  get: (id: number) => Promise<ApiResponseWithData<T>>,
  all: () => Promise<ApiResponseWithData<Array<T>>>,
  update: (data: T) => Promise<ApiResponseWithData<T>>,
  delete: (id: number) => Promise<ApiResponse>
}