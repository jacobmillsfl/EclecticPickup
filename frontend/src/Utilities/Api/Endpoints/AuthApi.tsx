import { UserModel } from "../../../Types/DbModels";
import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse, ApiResponseWithData } from "../ApiTypes";

export class AuthApi {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async registerUser(
    user: Omit<UserModel, "id">
  ): Promise<ApiResponseWithData<UserModel>> {
    const jwtToken = AuthManager.getAuthToken();
    const response = await fetch(`${this.config.apiUrl}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${jwtToken}`
      },
      body: JSON.stringify({
        ...user
      }),
    });
    const result = await response.json();

    return {
      ...result,
      status: response.status,
    }  as ApiResponseWithData<UserModel>;
  }

  async login(username: string, password: string): Promise<ApiResponse> {
    const response = await fetch(`${this.config.apiUrl}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: username,
        password: password,
      }),
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
    }  as ApiResponse;
  }
}
