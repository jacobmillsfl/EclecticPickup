import { BandVideoModel } from "../../../Types/DbModels";
import AuthManager from "../../AuthManager";
import { ApiConfig, ApiResponse, ApiResponseWithData, ICrudApi } from "../ApiTypes";

export class BandVideoApi implements ICrudApi<BandVideoModel> {
    private config: ApiConfig;

    constructor(config: ApiConfig) {
        this.config = config;
    }

    async create(
        bandVideo: Omit<BandVideoModel, "id">
    ): Promise<ApiResponseWithData<BandVideoModel>> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandvideos`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
                ...bandVideo
            }),
        });
        const result = await response.json();

        return {
            ...result,
            status: response.status,
            data: response.status === 200
                ? {
                    ...result.data,
                    src: result.data.youtube ? result.data.src : `${this.config.apiUrl}/bandvideos/${result.data.src}`
                }
                : undefined,
        };
    }

    async get(bandVideoId: number): Promise<ApiResponseWithData<BandVideoModel>> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandvideos/${bandVideoId}`, {
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
                ? {
                    ...result.data,
                    src: result.data.youtube ? result.data.src : `${this.config.apiUrl}/bandvideos/${result.data.src}`
                }
                : undefined,
        };
    }

    async all(): Promise<ApiResponseWithData<Array<BandVideoModel>>> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandvideos`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });
        const result = await response.json();

        return {
            ...result,
            status: response.status,
            data: result.data.map((video: BandVideoModel) => ({
                ...video,
                src: result.data.youtube ? result.data.src : `${this.config.apiUrl}/bandvideos/${result.data.src}`,
            })),
        };
    }

    async update(
        bandVideo: Omit<BandVideoModel, "src">
    ): Promise<ApiResponseWithData<BandVideoModel>> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandvideos/${bandVideo.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({ ...bandVideo }),
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

    async delete(bandVideoId: number): Promise<ApiResponse> {
        const jwtToken = AuthManager.getAuthToken();

        const response = await fetch(`${this.config.apiUrl}/bandvideos/${bandVideoId}`, {
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
