import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse, SettingApiResponse, SettingsApiResponse } from "../ApiTypes";

export class SettingsApi {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async createSetting(
    name: string,
    value: string
  ): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/settings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: name,
        value: value,
      }),
    });
    const result = await response.json();
    const data = {
      ...result,
      status: response.status,
    } as ApiResponse;
    return data;
  }

  async getSettingById(settingId: number): Promise<SettingApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/settings/${settingId}`, {
      method: "GET",
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

  async getAllSettings(): Promise<SettingsApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/settings`, {
      method: "GET",
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

  async updateSetting(
    settingId: number,
    name: string,
    value: string
  ): Promise<SettingApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/settings/${settingId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        name: name,
        value: value,
      }),
    });
    const result = await response.json();
    const data = {
      ...result,
      status: response.status,
    };
    return data;
  }

  async deleteSetting(settingId: number): Promise<ApiResponse> {
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

  async getSettingByName(settingName: string): Promise<SettingApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/settings/name/${settingName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const result = await response.json();
    console.log("API RESULT", result)
    const data = {
      ...result,
      status: response.status,
    };
    return data;
  }
}
