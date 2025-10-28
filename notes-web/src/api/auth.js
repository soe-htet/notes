import api from "./client";

export const me = async () => (await api.get("/me")).data.user;

export const login = async (payload) => {
  const { data } = await api.post("/auth/login", payload);
  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user: data.user,
  };
};

export const signup = async (payload) => {
  const { data } = await api.post("/auth/register", payload);
  return data; // expect { accessToken, user }
};
