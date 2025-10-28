import api from "./client";

// Fetch current user (if not in /auth/me)
export const getProfile = async () => (await api.get("/me")).data.user;

// Update name or image (multipart form)
export const updateProfile = async (payload) => {
  const form = new FormData();
  if (payload.name) form.append("name", payload.name);
  if (payload.profileImage) form.append("profileImage", payload.profileImage);
  const { data } = await api.post("/me/profileImage2", form);
  return data.user; // expect updated user object
};
