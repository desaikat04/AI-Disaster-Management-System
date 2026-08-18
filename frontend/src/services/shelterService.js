import api from "../api/api";

// =========================================
// GET ALL SHELTERS
// =========================================
export const getShelters = async () => {
  const response = await api.get("/shelters/");
  return response.data;
};

// =========================================
// CREATE SHELTER
// =========================================
export const createShelter = async (shelter) => {
  const response = await api.post("/shelters/", shelter);
  return response.data;
};

// =========================================
// UPDATE SHELTER
// =========================================
export const updateShelter = async (id, shelter) => {
  const response = await api.put(`/shelters/${id}`, shelter);
  return response.data;
};

// =========================================
// DELETE SHELTER
// =========================================
export const deleteShelter = async (id) => {
  const response = await api.delete(`/shelters/${id}`);
  return response.data;
};