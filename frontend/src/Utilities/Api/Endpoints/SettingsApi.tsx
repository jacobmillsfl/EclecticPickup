import { SettingsModel } from "../../../Types/DbModels";
import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse, ApiResponseWithData, ICrudApi } from "../ApiTypes";

export class SettingsApi implements ICrudApi<SettingsModel> {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async create(
    setting: Omit<SettingsModel, "id">
  ): Promise<ApiResponseWithData<SettingsModel>> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        ...setting
      }),
    });
    const result = await response.json();

    return {
      ...result,
      status: response.status,
      data: response.status === 200
        ? result.data
        : undefined,
    };
  }

  async get(settingId: number): Promise<ApiResponseWithData<SettingsModel>> {
    const response = await fetch(`${this.config.apiUrl}/settings/${settingId}`, {
      method: "GET",
    });
    const result = await response.json();

    return {
      ...result,
      status: response.status,
      data: response.status === 200
        ? result.data
        : undefined,
    };
  }

  async all(): Promise<ApiResponseWithData<Array<SettingsModel>>> {
    const response = await fetch(`${this.config.apiUrl}/settings`, {
      method: "GET",
      cache: "no-store",
    });
    const result = await response.json();
    const rows = Array.isArray(result?.data)
      ? result.data
      : Array.isArray(result)
        ? result
        : [];
    return {
      ...result,
      status: response.status,
      data: rows,
    };
  }

  async update(
    setting: SettingsModel
  ): Promise<ApiResponseWithData<SettingsModel>> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/settings/${setting.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({...setting}),
    });
    const result = await response.json();

    return {
      ...result,
      status: response.status,
      data: response.status === 200
        ? result.data
        : undefined,
    };
  }

  async delete(settingId: number): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/settings/${settingId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const result = await response.json();
    const data = {
      ...result,
      status: response.status,
    };
    return data;
  }

  async getSettingByName(settingName: string): Promise<ApiResponseWithData<SettingsModel>> {
    const response = await fetch(`${this.config.apiUrl}/settings/name/${settingName}`, {
      method: "GET",
    });
    const result = await response.json();

    return {
      ...result,
      status: response.status,
      data: response.status === 200
        ? result.data
        : undefined,
    };
  }
}
