import api from "./client";

export const listNotes = async ({ q, category, page = 1, limit = 5 }) => {
  const { data } = await api.get("/note/all", {
    params: { q, category, page, limit },
  });
  return data; // [{ _id, title, description, category, date, createdAt }]
};

export const getNote = async (id) =>
  (await api.get(`/note/one/${id}`)).data.note;

export const createNote = async (payload) =>
  (await api.post("/note/add", payload)).data;

export const updateNote = async (id, payload) =>
  (await api.put(`/note/update/${id}`, payload)).data;

export const deleteNote = async (id) =>
  (await api.delete(`/note/delete/${id}`)).data;
