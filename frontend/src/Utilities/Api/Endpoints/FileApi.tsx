import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse } from "../ApiTypes";

export class FileApi {
    private config: ApiConfig;

    constructor(config: ApiConfig) {
        this.config = config;
    }

    async upload(file: File): Promise<ApiResponse> {
        const jwtToken = AuthManager.getAuthToken();
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.config.apiUrl}/upload`, {
            method: "POST",
            headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
            body: formData,
        });
        const result = await response.json();

        return {
            ...result,
            status: response.status
        };
    }

    async delete(filename: string):  Promise<ApiResponse> {
        const jwtToken = AuthManager.getAuthToken();
        const response = await fetch(`${this.config.apiUrl}/delete/${encodeURIComponent(filename)}`, {
            method: "DELETE",
            headers: jwtToken ? { Authorization: `Bearer ${jwtToken}` } : {},
        });
        const result = await response.json();

        return {
            ...result,
            status: response.status
        };
    }
}