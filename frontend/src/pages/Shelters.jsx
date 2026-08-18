import { useEffect, useState } from "react";

import DisasterMap from "../components/DisasterMap";

import {
  getShelters,
  createShelter,
  updateShelter,
  deleteShelter,
} from "../services/shelterService";

function Shelters() {
  const [shelters, setShelters] = useState([]);

  // Add/Edit popup
  const [showForm, setShowForm] = useState(false);

  // Edit mode
  const [editingId, setEditingId] = useState(null);

  // Search
  const [searchTerm, setSearchTerm] = useState("");

  // Map layer: Shelters are shown first on the Shelters page.
  const [activeMapLayer, setActiveMapLayer] = useState("shelters");

  // =========================================
  // EMPTY FORM
  // =========================================

  const emptyShelter = {
    name: "",
    address: "",
    capacity: "",
    latitude: "",
    longitude: "",
  };

  const [formData, setFormData] = useState(emptyShelter);

  // =========================================
  // LOAD SHELTERS
  // =========================================

  useEffect(() => {
    loadShelters();
  }, []);

  const loadShelters = async () => {
    try {
      const data = await getShelters();
      setShelters(data);
    } catch (error) {
      console.error("Failed to load shelters:", error);
    }
  };

  // =========================================
  // SEARCH
  // =========================================

  const filteredShelters = shelters.filter((shelter) => {
    const search = searchTerm.toLowerCase();

    const name = shelter.name?.toLowerCase() || "";
    const address = shelter.address?.toLowerCase() || "";

    return (
      name.includes(search) ||
      address.includes(search)
    );
  });

  // =========================================
  // OPEN ADD FORM
  // =========================================

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyShelter);
    setShowForm(true);
  };

  // =========================================
  // OPEN EDIT FORM
  // =========================================

  const openEditForm = (shelter) => {
    setEditingId(shelter.id);

    setFormData({
      name: shelter.name || "",
      address: shelter.address || "",
      capacity: shelter.capacity ?? "",
      latitude: shelter.latitude ?? "",
      longitude: shelter.longitude ?? "",
    });

    setShowForm(true);
  };

  // =========================================
  // CLOSE FORM
  // =========================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyShelter);
  };

  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // =========================================
  // CREATE / UPDATE
  // =========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (
      !formData.name.trim() ||
      !formData.address.trim() ||
      formData.capacity === "" ||
      formData.latitude === "" ||
      formData.longitude === ""
    ) {
      alert("Please fill all fields.");
      return;
    }

    const capacity = Number(formData.capacity);
    const latitude = Number(formData.latitude);
    const longitude = Number(formData.longitude);

    if (capacity < 0) {
      alert("Capacity cannot be negative.");
      return;
    }

    if (latitude < -90 || latitude > 90) {
      alert("Latitude must be between -90 and 90.");
      return;
    }

    if (longitude < -180 || longitude > 180) {
      alert("Longitude must be between -180 and 180.");
      return;
    }

    try {
      // IMPORTANT:
      // These fields match the backend Shelter schema.
      const shelterData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        capacity: capacity,
        latitude: latitude,
        longitude: longitude,
      };

      // =====================================
      // UPDATE
      // =====================================

      if (editingId !== null) {
        await updateShelter(
          editingId,
          shelterData
        );

        alert("Shelter updated successfully.");
      }

      // =====================================
      // CREATE
      // =====================================

      else {
        await createShelter(shelterData);

        alert("Shelter created successfully.");
      }

      closeForm();

      await loadShelters();

    } catch (error) {
      console.error("Shelter API Error:", error);

      // Show backend error if available
      const backendMessage =
        error?.response?.data?.detail;

      if (backendMessage) {
        alert(
          `Failed to ${
            editingId !== null
              ? "update"
              : "create"
          } shelter.\n\n${JSON.stringify(
            backendMessage,
            null,
            2
          )}`
        );
      } else {
        alert(
          editingId !== null
            ? "Failed to update shelter."
            : "Failed to create shelter."
        );
      }
    }
  };

  // =========================================
  // DELETE
  // =========================================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this shelter?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteShelter(id);

      alert("Shelter deleted successfully.");

      await loadShelters();

    } catch (error) {
      console.error("Delete shelter error:", error);

      const backendMessage =
        error?.response?.data?.detail;

      if (backendMessage) {
        alert(
          `Failed to delete shelter.\n\n${JSON.stringify(
            backendMessage,
            null,
            2
          )}`
        );
      } else {
        alert("Failed to delete shelter.");
      }
    }
  };

  // =========================================
  // UI
  // =========================================

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background: "#111827",
        color: "white",
      }}
    >

      {/* =====================================
          HEADER
      ===================================== */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            margin: 0,
          }}
        >
          Shelter Management
        </h1>

        <button
          onClick={openAddForm}
          style={addBtn}
        >
          + Add Shelter
        </button>
      </div>

      {/* =====================================
          SEARCH
      ===================================== */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="🔎 Search by name or address..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={searchInput}
        />
      </div>

      {/* RESULT COUNT */}

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "15px",
        }}
      >
        Showing {filteredShelters.length} of{" "}
        {shelters.length} shelters
      </p>

      {/* =====================================
          TABLE
      ===================================== */}

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            background: "#1f2937",
            color: "white",
          }}
        >
          <thead>
            <tr>
              <th style={th}>ID</th>
              <th style={th}>Name</th>
              <th style={th}>Address</th>
              <th style={th}>Capacity</th>
              <th style={th}>Latitude</th>
              <th style={th}>Longitude</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredShelters.length === 0 ? (

              <tr>
                <td
                  colSpan="7"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#9ca3af",
                  }}
                >
                  No shelters found.
                </td>
              </tr>

            ) : (

              filteredShelters.map((shelter) => (

                <tr key={shelter.id}>

                  <td style={td}>
                    {shelter.id}
                  </td>

                  <td style={td}>
                    {shelter.name}
                  </td>

                  <td style={td}>
                    {shelter.address}
                  </td>

                  <td style={td}>
                    {shelter.capacity}
                  </td>

                  <td style={td}>
                    {shelter.latitude}
                  </td>

                  <td style={td}>
                    {shelter.longitude}
                  </td>

                  <td style={td}>

                    <button
                      onClick={() =>
                        openEditForm(shelter)
                      }
                      style={editBtn}
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(shelter.id)
                      }
                      style={deleteBtn}
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))

            )}

          </tbody>
        </table>
      </div>

      {/* =====================================
          LIVE MAP
      ===================================== */}

      <section
        style={{
          marginTop: "40px",
          marginBottom: "30px",
        }}
      >
        <h2
          style={{
            fontSize: "28px",
            margin: "0 0 8px 0",
          }}
        >
          🗺 Live Map
        </h2>

        <p
          style={{
            color: "#9ca3af",
            marginTop: 0,
            marginBottom: "18px",
          }}
        >
          Select what you want to view on the map.
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            marginBottom: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={() => setActiveMapLayer("disasters")}
            style={{
              ...mapFilterBtn,
              ...(activeMapLayer === "disasters"
                ? mapFilterBtnActive
                : {}),
            }}
          >
            🚨 Disasters
          </button>

          <button
            onClick={() => setActiveMapLayer("shelters")}
            style={{
              ...mapFilterBtn,
              ...(activeMapLayer === "shelters"
                ? mapFilterBtnActive
                : {}),
            }}
          >
            🏠 Shelters
          </button>

          <button
            onClick={() => setActiveMapLayer("resources")}
            style={{
              ...mapFilterBtn,
              ...(activeMapLayer === "resources"
                ? mapFilterBtnActive
                : {}),
            }}
          >
            🚑 Resources
          </button>
        </div>

        <div
          style={{
            background: "#1f2937",
            border: "1px solid #374151",
            borderRadius: "12px",
            padding: "10px",
          }}
        >
          <DisasterMap activeLayer={activeMapLayer} />
        </div>
      </section>


      {/* =====================================
          ADD / EDIT POPUP
      ===================================== */}

      {showForm && (

        <div
          style={overlay}
          onClick={closeForm}
        >

          <div
            style={modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* HEADER */}

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "25px",
              }}
            >

              <h2
                style={{
                  margin: 0,
                  fontSize: "26px",
                }}
              >
                {editingId !== null
                  ? "Edit Shelter"
                  : "Add New Shelter"}
              </h2>

              <button
                onClick={closeForm}
                style={closeBtn}
              >
                ✕
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              {/* NAME */}

              <input
                name="name"
                style={inputStyle}
                placeholder="Shelter Name"
                value={formData.name}
                onChange={handleChange}
              />

              {/* ADDRESS */}

              <input
                name="address"
                style={inputStyle}
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              />

              {/* CAPACITY */}

              <input
                name="capacity"
                type="number"
                min="0"
                style={inputStyle}
                placeholder="Capacity"
                value={formData.capacity}
                onChange={handleChange}
              />

              {/* LATITUDE */}

              <input
                name="latitude"
                type="number"
                step="any"
                style={inputStyle}
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
              />

              {/* LONGITUDE */}

              <input
                name="longitude"
                type="number"
                step="any"
                style={inputStyle}
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
              />

              {/* BUTTONS */}

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "15px",
                  marginTop: "25px",
                }}
              >

                <button
                  type="submit"
                  style={saveBtn}
                >
                  {editingId !== null
                    ? "Update Shelter"
                    : "Save Shelter"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  style={cancelBtn}
                >
                  Cancel
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

/* =========================================
   STYLES
========================================= */

const addBtn = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "12px 20px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "15px",
};

const searchInput = {
  flex: 1,
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #4b5563",
  background: "#1f2937",
  color: "white",
  fontSize: "15px",
  outline: "none",
};

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  padding: "13px",
  marginTop: "12px",
  borderRadius: "7px",
  border: "1px solid #4b5563",
  background: "#374151",
  color: "white",
  fontSize: "15px",
  outline: "none",
};

const th = {
  border: "1px solid #4b5563",
  padding: "14px",
  background: "#111827",
  fontSize: "15px",
};

const td = {
  border: "1px solid #4b5563",
  padding: "14px",
  textAlign: "center",
};

const editBtn = {
  background: "#f59e0b",
  color: "white",
  border: "none",
  padding: "7px 14px",
  borderRadius: "5px",
  cursor: "pointer",
  marginRight: "10px",
};

const deleteBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "7px 14px",
  borderRadius: "5px",
  cursor: "pointer",
};

const mapFilterBtn = {
  background: "#1f2937",
  color: "#d1d5db",
  border: "1px solid #4b5563",
  padding: "10px 16px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
  fontSize: "14px",
};

const mapFilterBtnActive = {
  background: "#2563eb",
  color: "white",
  border: "1px solid #2563eb",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.7)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modal = {
  width: "500px",
  maxWidth: "90%",
  maxHeight: "90vh",
  overflowY: "auto",
  background: "#1f2937",
  color: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow:
    "0 20px 50px rgba(0,0,0,0.5)",
};

const closeBtn = {
  background: "transparent",
  color: "#9ca3af",
  border: "none",
  fontSize: "22px",
  cursor: "pointer",
};

const saveBtn = {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "11px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

const cancelBtn = {
  background: "#dc2626",
  color: "white",
  border: "none",
  padding: "11px 20px",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Shelters;