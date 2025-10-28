import api from "./client";
export const listCategories = async () =>
  (await api.get("/note/categories")).data.categories; // ["Work","Personal",...]
