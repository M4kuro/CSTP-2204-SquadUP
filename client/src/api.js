import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? "https://cstp-2204-squadup-production.up.railway.app/api" // im assuming this is our actual backend URL in raileway
    : "/api",
});

export default api;
