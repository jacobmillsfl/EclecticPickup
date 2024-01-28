import { UserModel } from "../../../Types/DbModels";
import AuthManager from "../../AuthManager";
import {
  ApiConfig,
  ApiResponse,
  ICrudApi,
  ApiResponseWithData,
} from "../ApiTypes";

export class UserApi implements ICrudApi<UserModel> {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async get(userId: number): Promise<ApiResponseWithData<UserModel>> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/users/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const result = await response.json();

    return {
      ...result,
      status: response.status,
    };
  }

  async all(): Promise<ApiResponseWithData<Array<UserModel>>> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/users`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
    };
  }

  async create(
    user: Omit<UserModel, "id">
  ): Promise<ApiResponseWithData<UserModel>> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(user),
    });

    const result = await response.json();
    return {
      ...result,
      status: response.status,
    };
  }

  async update(
    user: UserModel
  ): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify(user),
    });

    const result = await response.json();
    return {
      ...result,
      status: response.status,
    };
  }

  async delete(id: number): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();
    const response = await fetch(`${this.config.apiUrl}/users/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
    };
  }
}
