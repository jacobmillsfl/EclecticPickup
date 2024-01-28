import { BandImageModel } from "../../../Types/DbModels";
import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse, ApiResponseWithData, ICrudApi } from "../ApiTypes";

export class BandImageApi implements ICrudApi<BandImageModel> {
    private config: ApiConfig;

    constructor(config: ApiConfig) {
        this.config = config;
    }

    async create(
        bandImage: Omit<BandImageModel, "id">
    ): Promise<ApiResponseWithData<BandImageModel>> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandimages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
                ...bandImage
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

    async get(bandImageId: number): Promise<ApiResponseWithData<BandImageModel>> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandimages/${bandImageId}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const result = await response.json();

        return {
            ...result,
            status: response.status,
            data: response.status === 200
                ? { ...result.data, filename: `${this.config.apiUrl}/files/${result.data.filename}` }
                : undefined,
        };
    }

    async all(): Promise<ApiResponseWithData<Array<BandImageModel>>> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandimages`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const result = await response.json();

        return {
            ...result,
            status: response.status,
            data: result.data.map((image: BandImageModel) => ({
                ...image,
                filename: `${this.config.apiUrl}/files/${image.filename}`,
            })),
        };
    }

    async update(
        bandImage: Omit<BandImageModel, "filename">
    ): Promise<ApiResponseWithData<BandImageModel>> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandimages/${bandImage.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ ...bandImage }),
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

    async delete(bandImageId: number): Promise<ApiResponse> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandimages/${bandImageId}`, {
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
}
