import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse, ApiResponseWithData, ICrudApi } from "../ApiTypes";
import SocialLinkModel from "../../../Types/DbModels/SocialLinkModel";

export class SocialLinkApi implements ICrudApi<SocialLinkModel> {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private authHeaders(): HeadersInit {
    const token = AuthManager.getAuthToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  async all(): Promise<ApiResponseWithData<Array<SocialLinkModel>>> {
    const response = await fetch(`${this.config.apiUrl}/sociallinks`, {
      method: "GET",
    });
    const result = await response.json();
    return { ...result, status: response.status };
  }

  async get(linkId: number): Promise<ApiResponseWithData<SocialLinkModel>> {
    const response = await fetch(`${this.config.apiUrl}/sociallinks/${linkId}`, {
      method: "GET",
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
      data: response.status === 200 ? result.data : undefined,
    };
  }

  async create(
    link: Omit<SocialLinkModel, "id">
  ): Promise<ApiResponseWithData<SocialLinkModel>> {
    const response = await fetch(`${this.config.apiUrl}/sociallinks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders(),
      },
      body: JSON.stringify({
        platform: link.platform,
        text: link.text,
        enabled: link.enabled,
        href_url: link.href_url,
      }),
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
      data: response.status === 200 ? result.data : undefined,
    };
  }

  async update(link: SocialLinkModel): Promise<ApiResponseWithData<SocialLinkModel>> {
    const response = await fetch(`${this.config.apiUrl}/sociallinks/${link.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders(),
      },
      body: JSON.stringify({
        platform: link.platform,
        text: link.text,
        enabled: link.enabled,
        href_url: link.href_url,
      }),
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
      data: response.status === 200 ? result.data : undefined,
    };
  }

  async delete(linkId: number): Promise<ApiResponse> {
    const response = await fetch(`${this.config.apiUrl}/sociallinks/${linkId}`, {
      method: "DELETE",
      headers: { ...this.authHeaders() },
    });
    const result = await response.json();
    return { ...result, status: response.status };
  }
}
