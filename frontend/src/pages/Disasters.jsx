import { useEffect, useState } from "react";

import DisasterMap from "../components/DisasterMap";

import {
  getDisasters,
  createDisaster,
  updateDisaster,
  deleteDisaster,
} from "../services/disasterService";

import { getShelters } from "../services/shelterService";
import { getResources } from "../services/resourceService";

function Disasters() {
  const [disasters, setDisasters] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);

  // Map layer: Disaster is shown first.
  const [activeMapLayer, setActiveMapLayer] = useState("disasters");

  // Add/Edit popup
  const [showForm, setShowForm] = useState(false);

  // Edit mode
  const [editingId, setEditingId] = useState(null);

  // Search and filter
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  const emptyDisaster = {
    disaster_type: "",
    location: "",
    severity: "",
    latitude: "",
    longitude: "",
  };

  const [formData, setFormData] = useState(emptyDisaster);

  // -----------------------------
  // Load disasters
  // -----------------------------
  useEffect(() => {
    loadDisasters();
  }, []);

  const loadDisasters = async () => {
    try {
      const [disasterData, shelterData, resourceData] =
        await Promise.all([
          getDisasters(),
          getShelters(),
          getResources(),
        ]);

      setDisasters(disasterData || []);
      setShelters(shelterData || []);
      setResources(resourceData || []);
    } catch (error) {
      console.error("Failed to load map data:", error);
    }
  };

  // -----------------------------
  // Search + Severity Filter
  // -----------------------------
  const filteredDisasters = disasters.filter((disaster) => {
    const search = searchTerm.toLowerCase();

    const disasterType =
      disaster.disaster_type?.toLowerCase() || "";

    const location =
      disaster.location?.toLowerCase() || "";

    const matchesSearch =
      disasterType.includes(search) ||
      location.includes(search);

    const matchesSeverity =
      severityFilter === "All" ||
      disaster.severity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  // -----------------------------
  // Open Add Popup
  // -----------------------------
  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyDisaster);
    setShowForm(true);
  };

  // -----------------------------
  // Open Edit Popup
  // -----------------------------
  const openEditForm = (disaster) => {
    setEditingId(disaster.id);

    setFormData({
      disaster_type: disaster.disaster_type || "",
      location: disaster.location || "",
      severity: disaster.severity || "",
      latitude: disaster.latitude ?? "",
      longitude: disaster.longitude ?? "",
    });

    setShowForm(true);
  };

  // -----------------------------
  // Close Popup
  // -----------------------------
  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyDisaster);
  };

  // -----------------------------
  // Handle Input Changes
  // -----------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // -----------------------------
  // Save / Update Disaster
  // -----------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.disaster_type ||
      !formData.location ||
      !formData.severity ||
      !formData.latitude ||
      !formData.longitude
    ) {
      alert("Please fill all fields.");
      return;
    }

    try {
      const disasterData = {
        disaster_type: formData.disaster_type,
        location: formData.location,
        severity: formData.severity,
        latitude: Number(formData.latitude),
        longitude: Number(formData.longitude),
      };

      // EDIT
      if (editingId !== null) {
        await updateDisaster(editingId, disasterData);
        alert("Disaster updated successfully.");
      }

      // ADD
      else {
        await createDisaster(disasterData);
        alert("Disaster created successfully.");
      }

      closeForm();
      loadDisasters();

    } catch (error) {
      console.error(error);

      alert(
        editingId !== null
          ? "Failed to update disaster."
          : "Failed to create disaster."
      );
    }
  };

  // -----------------------------
  // Delete Disaster
  // -----------------------------
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this disaster?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      await deleteDisaster(id);

      alert("Disaster deleted successfully.");

      loadDisasters();

    } catch (error) {
      console.error(error);
      alert("Failed to delete disaster.");
    }
  };

  return (
    <div
      style={{
        padding: "40px",
        minHeight: "100vh",
        background: "#111827",
        color: "white",
      }}
    >

      {/* =========================================
          HEADER
      ========================================= */}

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
          Disaster Management
        </h1>

        <button
          onClick={openAddForm}
          style={addBtn}
        >
          + Add Disaster
        </button>
      </div>


      {/* =========================================
          SEARCH + FILTER
      ========================================= */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "25px",
          flexWrap: "wrap",
        }}
      >

        {/* Search */}

        <input
          type="text"
          placeholder="🔎 Search by type or location..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={searchInput}
        />


        {/* Severity Filter */}

        <select
          value={severityFilter}
          onChange={(e) => setSeverityFilter(e.target.value)}
          style={filterSelect}
        >
          <option value="All">
            All Severities
          </option>

          <option value="High">
            High
          </option>

          <option value="Medium">
            Medium
          </option>

          <option value="Low">
            Low
          </option>
        </select>


        {/* Clear Filters */}

        {(searchTerm || severityFilter !== "All") && (
          <button
            onClick={() => {
              setSearchTerm("");
              setSeverityFilter("All");
            }}
            style={clearBtn}
          >
            Clear
          </button>
        )}

      </div>


      {/* Result count */}

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "15px",
        }}
      >
        Showing {filteredDisasters.length} of {disasters.length} disasters
      </p>


      {/* =========================================
          DISASTER TABLE
      ========================================= */}

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
              <th style={th}>Type</th>
              <th style={th}>Location</th>
              <th style={th}>Severity</th>
              <th style={th}>Actions</th>
            </tr>
          </thead>

          <tbody>

            {filteredDisasters.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#9ca3af",
                  }}
                >
                  No disasters found.
                </td>
              </tr>

            ) : (

              filteredDisasters.map((disaster) => (

                <tr key={disaster.id}>

                  <td style={td}>
                    {disaster.id}
                  </td>

                  <td style={td}>
                    {disaster.disaster_type}
                  </td>

                  <td style={td}>
                    {disaster.location}
                  </td>

                  <td style={td}>

                    <span
                      style={{
                        ...severityBadge,

                        background:
                          disaster.severity === "High"
                            ? "#dc2626"
                            : disaster.severity === "Medium"
                            ? "#f59e0b"
                            : "#16a34a",
                      }}
                    >
                      {disaster.severity}
                    </span>

                  </td>

                  <td style={td}>

                    {/* EDIT */}

                    <button
                      onClick={() => openEditForm(disaster)}
                      style={editBtn}
                    >
                      Edit
                    </button>


                    {/* DELETE */}

                    <button
                      onClick={() => handleDelete(disaster.id)}
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


      {/* =========================================
          LIVE MAP
      ========================================= */}

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

        {/* MAP FILTER BUTTONS */}
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
          <DisasterMap
            activeLayer={activeMapLayer}
            disasters={disasters}
            shelters={shelters}
            resources={resources}
          />
        </div>
      </section>


      {/* =========================================
          ADD / EDIT POPUP
      ========================================= */}

      {showForm && (

        <div
          style={overlay}
          onClick={closeForm}
        >

          <div
            style={modal}
            onClick={(e) => e.stopPropagation()}
          >

            {/* Popup Header */}

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
                  ? "Edit Disaster"
                  : "Add New Disaster"}
              </h2>

              <button
                onClick={closeForm}
                style={closeBtn}
              >
                ✕
              </button>

            </div>


            {/* Form */}

            <form onSubmit={handleSubmit}>

              {/* Disaster Type */}

              <input
                name="disaster_type"
                style={inputStyle}
                placeholder="Disaster Type"
                value={formData.disaster_type}
                onChange={handleChange}
              />


              {/* Location */}

              <input
                name="location"
                style={inputStyle}
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
              />


              {/* Severity */}

              <select
                name="severity"
                style={inputStyle}
                value={formData.severity}
                onChange={handleChange}
              >

                <option value="">
                  Select Severity
                </option>

                <option value="Low">
                  Low
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="High">
                  High
                </option>

              </select>


              {/* Latitude */}

              <input
                name="latitude"
                type="number"
                step="any"
                style={inputStyle}
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
              />


              {/* Longitude */}

              <input
                name="longitude"
                type="number"
                step="any"
                style={inputStyle}
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
              />


              {/* Buttons */}

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
                    ? "Update Disaster"
                    : "Save Disaster"}
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
  minWidth: "250px",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #4b5563",
  background: "#1f2937",
  color: "white",
  fontSize: "15px",
  outline: "none",
};

const filterSelect = {
  padding: "12px",
  minWidth: "170px",
  borderRadius: "8px",
  border: "1px solid #4b5563",
  background: "#1f2937",
  color: "white",
  fontSize: "15px",
  outline: "none",
};

const clearBtn = {
  background: "#4b5563",
  color: "white",
  border: "none",
  padding: "12px 18px",
  borderRadius: "8px",
  cursor: "pointer",
  fontWeight: "bold",
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
  fontSize: "16px",
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

const severityBadge = {
  display: "inline-block",
  padding: "5px 12px",
  borderRadius: "15px",
  color: "white",
  fontWeight: "bold",
  fontSize: "13px",
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
  background: "#1f2937",
  color: "white",
  padding: "30px",
  borderRadius: "12px",
  boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
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

export default Disasters;