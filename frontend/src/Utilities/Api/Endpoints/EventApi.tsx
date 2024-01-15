import { Gig } from "../../../Types";
import { EventModel } from "../../../Types/DbModels";
import AuthManager from "../../AuthManager";
import {
  ApiConfig,
  ApiResponse,
  ICrudApi,
  ApiResponseWithData,
} from "../ApiTypes";

export class EventApi implements ICrudApi<EventModel> {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async get(eventId: number): Promise<ApiResponseWithData<EventModel>> {
    const response = await fetch(`${this.config.apiUrl}/events/${eventId}`, {
      method: "GET",
    });
    const result = await response.json();

    return {
      ...result,
      status: response.status,
      data: response.status === 200
        ? { ...result.data, date: new Date(`${result.data.date}T00:00:00`) }
        : undefined,
    };
  }

  async all(): Promise<ApiResponseWithData<Array<EventModel>>> {
    const response = await fetch(`${this.config.apiUrl}/events`, {
      method: "GET",
    });
    const result = await response.json();
    return {
      ...result,
      status: response.status,
      data: result.data.map((gig: Gig) => ({
        ...gig,
        date: new Date(`${gig.date}T00:00:00`),
      })),
    };
  }

  async create(
    event: Omit<EventModel, "id">
  ): Promise<ApiResponseWithData<EventModel>> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ ...event, date: event.date.toISOString().split('T')[0] }),
    });

    const result = await response.json();
    return {
      ...result,
      status: response.status,
      data: response.status === 200
        ? { ...result.data, date: new Date(`${result.data.date}T00:00:00`) }
        : undefined,
    };
  }

  async update(
    event: EventModel
  ): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/events/${event.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({ ...event, date: event.date.toISOString().split('T')[0]  }),
    });

    const result = await response.json();
    return {
      ...result,
      status: response.status,
    }
  }

  async delete(id: number): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();
    const response = await fetch(`${this.config.apiUrl}/events/${id}`, {
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
