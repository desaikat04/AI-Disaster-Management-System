import api from "../api/api";

// ===============================
// GET ALL DISASTERS
// ===============================
export const getDisasters = async () => {
    const response = await api.get("/disasters/");
    return response.data;
};


// ===============================
// GET SINGLE DISASTER
// ===============================
export const getDisasterById = async (id) => {
    const response = await api.get(`/disasters/${id}`);
    return response.data;
};


// ===============================
// CREATE DISASTER
// ===============================
export const createDisaster = async (disaster) => {
    const response = await api.post("/disasters/", disaster);
    return response.data;
};


// ===============================
// UPDATE DISASTER
// ===============================
export const updateDisaster = async (id, disaster) => {
    const response = await api.put(`/disasters/${id}`, disaster);
    return response.data;
};


// ===============================
// DELETE DISASTER
// ===============================
export const deleteDisaster = async (id) => {
    const response = await api.delete(`/disasters/${id}`);
    return response.data;
};