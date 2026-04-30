import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse, ApiResponseWithData, ICrudApi } from "../ApiTypes";
import BandMemberModel from "../../../Types/DbModels/BandMemberModel";
import { resolveBandMemberImageUrl } from "../publicContentMappers";

export class BandMemberApi implements ICrudApi<BandMemberModel> {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  private authHeaders(): HeadersInit {
    const token = AuthManager.getAuthToken();
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  /** Full URL for admin preview (matches public site resolution). */
  private withDisplayImg(m: BandMemberModel): BandMemberModel {
    return {
      ...m,
      img_url: resolveBandMemberImageUrl(
        m.img_url,
        this.config.apiUrl,
        process.env.PUBLIC_URL
      ),
    };
  }

  async all(): Promise<ApiResponseWithData<Array<BandMemberModel>>> {
    const response = await fetch(`${this.config.apiUrl}/bandmembers`, {
      method: "GET",
    });
    const result = await response.json();
    const data =
      result.data && Array.isArray(result.data)
        ? result.data.map((m: BandMemberModel) => this.withDisplayImg(m))
        : result.data;
    return { ...result, status: response.status, data };
  }

  async get(memberId: number): Promise<ApiResponseWithData<BandMemberModel>> {
    const response = await fetch(`${this.config.apiUrl}/bandmembers/${memberId}`, {
      method: "GET",
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
      data:
        response.status === 200 && result.data
          ? this.withDisplayImg(result.data)
          : undefined,
    };
  }

  async create(
    member: Omit<BandMemberModel, "id">
  ): Promise<ApiResponseWithData<BandMemberModel>> {
    const response = await fetch(`${this.config.apiUrl}/bandmembers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders(),
      },
      body: JSON.stringify(member),
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
      data:
        response.status === 200 && result.data
          ? this.withDisplayImg(result.data)
          : undefined,
    };
  }

  async update(member: BandMemberModel): Promise<ApiResponseWithData<BandMemberModel>> {
    const response = await fetch(`${this.config.apiUrl}/bandmembers/${member.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...this.authHeaders(),
      },
      body: JSON.stringify({
        name: member.name,
        img_url: member.img_url,
        text: member.text,
      }),
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
      data:
        response.status === 200 && result.data
          ? this.withDisplayImg(result.data)
          : undefined,
    };
  }

  async delete(memberId: number): Promise<ApiResponse> {
    const response = await fetch(`${this.config.apiUrl}/bandmembers/${memberId}`, {
      method: "DELETE",
      headers: { ...this.authHeaders() },
    });
    const result = await response.json();
    return { ...result, status: response.status };
  }
}
