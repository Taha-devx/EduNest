import api from "./api";

export const registerEducator = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

export const loginEducator = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

export const loginStudentWithGoogle = async (idToken) => {
  const response = await api.post("/auth/google", { idToken });
  return response.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/profile");
  return response.data;
};
