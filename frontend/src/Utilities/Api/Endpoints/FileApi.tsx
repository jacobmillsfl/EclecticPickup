import { ApiConfig, ApiResponse } from "../ApiTypes";

export class FileApi {
    private config: ApiConfig;

    constructor(config: ApiConfig) {
        this.config = config;
    }

    async upload(file: File): Promise<ApiResponse> {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${this.config.apiUrl}/upload`, {
            method: "POST",
            body: formData
        });
        const result = await response.json();

        return {
            ...result,
            status: response.status
        };
    }

    async delete(filename: string):  Promise<ApiResponse> {
        const response = await fetch(`${this.config.apiUrl}/delete/${filename}`, {
            method: "DELETE"
        });
        const result = await response.json();

        return {
            ...result,
            status: response.status
        };
    }
}