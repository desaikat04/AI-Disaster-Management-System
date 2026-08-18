import api from "../api/api";

// =========================================
// GET ALL RESOURCES
// =========================================

export const getResources = async () => {
  const response = await api.get("/resources/");
  return response.data;
};

// =========================================
// CREATE RESOURCE
// =========================================

export const createResource = async (resource) => {
  const response = await api.post("/resources/", resource);
  return response.data;
};

// =========================================
// UPDATE RESOURCE
// =========================================

export const updateResource = async (id, resource) => {
  const response = await api.put(`/resources/${id}`, resource);
  return response.data;
};

// =========================================
// DELETE RESOURCE
// =========================================

export const deleteResource = async (id) => {
  const response = await api.delete(`/resources/${id}`);
  return response.data;
};