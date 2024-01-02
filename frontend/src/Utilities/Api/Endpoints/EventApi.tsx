import { Gig } from "../../../Types";
import AuthManager from "../../AuthManager";
import {
  AllEventsApiResponse,
  ApiConfig,
  ApiResponse,
  EventsApiResponse,
} from "../ApiTypes";

export class EventApi {
  private config: ApiConfig;

  constructor(config: ApiConfig) {
    this.config = config;
  }

  async getEvent(eventId: number): Promise<EventsApiResponse> {
    const response = await fetch(`${this.config.apiUrl}/events/${eventId}`, {
      method: "GET",
    });
    const result = await response.json();
    if (response.status === 200) {
      console.log("RESULT", result);
      const data = {
        ...result,
        status: response.status,
        data: {
          ...result.data,
          date: new Date(`${result.data.date}T00:00:00`),
        },
      };
      return data;
    } else {
      return result;
    }
  }

  async getAllEvents(): Promise<AllEventsApiResponse> {
    const response = await fetch(`${this.config.apiUrl}/events`, {
      method: "GET",
    });
    const result = await response.json();
    const data: AllEventsApiResponse = {
      ...result,
      status: response.status,
      data: result.data.map((gig: Gig) => ({
        ...gig,
        date: new Date(`${gig.date}T00:00:00`),
      })),
    };
    return data;
  }

  async createEvent(
    date: string,
    time: string,
    venue: string,
    address: string
  ): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        date: date,
        time: time,
        venue: venue,
        address: address,
      }),
    });
    const result = await response.json();
    const data = {
      ...result,
      status: response.status,
    } as ApiResponse;
    return data;
  }

  async editEvent(
    eventId: number,
    date: string,
    time: string,
    venue: string,
    address: string
  ): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/events/${eventId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
      body: JSON.stringify({
        date: date,
        time: time,
        venue: venue,
        address: address,
      }),
    });
    const result = await response.json();
    const data = {
      ...result,
      status: response.status,
    } as ApiResponse;
    return data;
  }

  async deleteEvent(eventId: number): Promise<ApiResponse> {
    const jwtToken = AuthManager.getAuthToken();

    const response = await fetch(`${this.config.apiUrl}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
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
