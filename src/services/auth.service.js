import { api } from "src/boot/axios";

export const AuthService = {
  login: (payload) =>
    api.post("/api/v2/Auth/Login", payload).then((r) => r.data),

  register: (payload) =>
    api.post("/api/v2/Auth/Register", payload).then((r) => r.data),

  logout: () => api.post("/api/v2/Auth/Logout").then((r) => r.data),

  forgotPassword: (payload) =>
    api.post("/api/v2/Auth/ForgotPassword", payload).then((r) => r.data),

  resetPassword: (payload) =>
    api.post("/api/v2/Auth/ResetPassword", payload).then((r) => r.data),
};
