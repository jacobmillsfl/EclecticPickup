import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse } from "../ApiTypes";


export class UserApi {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

}
