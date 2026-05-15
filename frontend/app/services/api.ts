import axios from "axios";
import { useAuthStore } from "@/app/store/auth.store";

const baseURL = (function() {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl && envUrl !== "/") {
    return envUrl.replace(/\/$/, "");
  }
  
  // Default to localhost:3001 if on client or if no env var
  if (typeof window !== "undefined") {
    const { protocol, hostname } = window.location;
    return `${protocol}//${hostname}:3001`;
  }
  
  return "http://localhost:3001";
})();

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const accessToken = useAuthStore.getState().accessToken;

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});
