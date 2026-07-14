import axios, { AxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

type JsonValue =
  | string
  | number
  | boolean
  | null
  | { [key: string]: JsonValue }
  | JsonValue[];

export type PostAIArgs<TBody = unknown> = {
  endpoint: string;
  body: TBody;
  config?: AxiosRequestConfig;
};

const aiApiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_AI_API_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: 30000,
});

aiApiClient.interceptors.request.use((config) => {
  const token = Cookies.get("token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

function safeParseJson<T>(value: unknown): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      throw new Error("Response is not valid JSON.");
    }
  }

  if (value === undefined || value === null) {
    throw new Error("Empty response received from server.");
  }

  return value as T;
}

function extractErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status;
    const data = error.response?.data as any;
    const message =
      data?.message || data?.error || error.message || "Request failed.";

    if (status) {
      return `Request failed with status ${status}: ${message}`;
    }

    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please try again.";
    }

    if (!error.response) {
      return "Network error. Please check your connection and try again.";
    }

    return message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Unexpected error occurred while processing request.";
}

export async function postAIService<
  TResponse extends JsonValue | Record<string, unknown> = Record<
    string,
    unknown
  >,
  TBody = unknown
>({ endpoint, body, config }: PostAIArgs<TBody>): Promise<TResponse> {
  if (!endpoint || typeof endpoint !== "string") {
    throw new Error("A valid endpoint is required.");
  }
  if (!process.env.NEXT_PUBLIC_AI_API_BASE_URL) {
    throw new Error("AI base URL is missing: NEXT_PUBLIC_AI_API_BASE_URL");
  }

  try {
    const response = await aiApiClient.post(endpoint, body, config);
    return safeParseJson<TResponse>(response?.data);
  } catch (error) {
    throw new Error(extractErrorMessage(error));
  }
}
