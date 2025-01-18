import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: window.location.origin || import.meta.env.VITE_BASE_URL,
})