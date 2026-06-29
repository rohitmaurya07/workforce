import api from "../api/axios";

export const googleLogin = async (credential) => {
  const response = await api.post(
    "/auth/google",
    { credential }
  );

  return response.data;
};

export const getMe = async () => {
  const response = await api.get(
    "/auth/me"
  );

  return response.data;
};

export const logout = async () => {
  const response = await api.post(
    "/auth/logout"
  );

  return response.data;
};