import { useEffect, useState } from "react";

import DisasterMap from "../components/DisasterMap";

import {
  getResources,
  createResource,
  updateResource,
  deleteResource,
} from "../services/resourceService";


function Resources() {

  // =========================================
  // STATE
  // =========================================

  const [resources, setResources] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Map layer: Resources are shown first on the Resources page.
  const [activeMapLayer, setActiveMapLayer] = useState("resources");


  // =========================================
  // EMPTY FORM
  // =========================================

  const emptyResource = {
    resource_type: "",
    name: "",
    quantity: "",
    status: "",
    latitude: "",
    longitude: "",
  };


  const [formData, setFormData] =
    useState(emptyResource);


  // =========================================
  // LOAD RESOURCES
  // =========================================

  useEffect(() => {
    loadResources();
  }, []);


  const loadResources = async () => {

    try {

      const data = await getResources();

      setResources(data);

    } catch (error) {

      console.error(
        "Failed to load resources:",
        error
      );

    }

  };


  // =========================================
  // SEARCH
  // =========================================

  const filteredResources = resources.filter(
    (resource) => {

      const search =
        searchTerm.toLowerCase();

      const type =
        resource.resource_type
          ?.toLowerCase() || "";

      const name =
        resource.name?.toLowerCase() || "";

      const status =
        resource.status
          ?.toLowerCase() || "";

      return (
        type.includes(search) ||
        name.includes(search) ||
        status.includes(search)
      );

    }
  );


  // =========================================
  // OPEN ADD FORM
  // =========================================

  const openAddForm = () => {

    setEditingId(null);

    setFormData(emptyResource);

    setShowForm(true);

  };


  // =========================================
  // OPEN EDIT FORM
  // =========================================

  const openEditForm = (resource) => {

    setEditingId(resource.id);

    setFormData({

      resource_type:
        resource.resource_type || "",

      name:
        resource.name || "",

      quantity:
        resource.quantity ?? 0,

      status:
        resource.status || "",

      latitude:
        resource.latitude ?? "",

      longitude:
        resource.longitude ?? "",

    });

    setShowForm(true);

  };


  // =========================================
  // CLOSE FORM
  // =========================================

  const closeForm = () => {

    setShowForm(false);

    setEditingId(null);

    setFormData(emptyResource);

  };


  // =========================================
  // HANDLE INPUT
  // =========================================

  const handleChange = (e) => {

    const {
      name,
      value
    } = e.target;

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
      !formData.resource_type.trim() ||
      !formData.name.trim() ||
      formData.quantity === "" ||
      !formData.status.trim() ||
      formData.latitude === "" ||
      formData.longitude === ""
    ) {

      alert(
        "Please fill all fields."
      );

      return;

    }


    const quantity =
      Number(formData.quantity);


    // Quantity validation

    if (
      !Number.isInteger(quantity) ||
      quantity < 0
    ) {

      alert(
        "Quantity must be a whole number greater than or equal to 0."
      );

      return;

    }


    const latitude =
      Number(formData.latitude);


    const longitude =
      Number(formData.longitude);


    // Latitude validation

    if (
      latitude < -90 ||
      latitude > 90
    ) {

      alert(
        "Latitude must be between -90 and 90."
      );

      return;

    }


    // Longitude validation

    if (
      longitude < -180 ||
      longitude > 180
    ) {

      alert(
        "Longitude must be between -180 and 180."
      );

      return;

    }


    try {

      // =====================================
      // DATA SENT TO BACKEND
      // =====================================

      const resourceData = {

        resource_type:
          formData.resource_type.trim(),

        name:
          formData.name.trim(),

        quantity:
          quantity,

        status:
          formData.status.trim(),

        latitude:
          latitude,

        longitude:
          longitude,

      };


      // =====================================
      // UPDATE
      // =====================================

      if (editingId !== null) {

        await updateResource(
          editingId,
          resourceData
        );

        alert(
          "Resource updated successfully."
        );

      }


      // =====================================
      // CREATE
      // =====================================

      else {

        await createResource(
          resourceData
        );

        alert(
          "Resource created successfully."
        );

      }


      closeForm();

      await loadResources();


    } catch (error) {

      console.error(
        "Resource API Error:",
        error
      );


      const backendMessage =
        error?.response?.data?.detail;


      if (backendMessage) {

        alert(
          `Failed to ${
            editingId !== null
              ? "update"
              : "create"
          } resource.\n\n${JSON.stringify(
            backendMessage,
            null,
            2
          )}`
        );

      }

      else {

        alert(
          editingId !== null
            ? "Failed to update resource."
            : "Failed to create resource."
        );

      }

    }

  };


  // =========================================
  // DELETE RESOURCE
  // =========================================

  const handleDelete = async (id) => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this resource?"
      );


    if (!confirmDelete) {
      return;
    }


    try {

      await deleteResource(id);


      alert(
        "Resource deleted successfully."
      );


      await loadResources();


    } catch (error) {

      console.error(
        "Delete resource error:",
        error
      );


      const backendMessage =
        error?.response?.data?.detail;


      if (backendMessage) {

        alert(
          `Failed to delete resource.\n\n${JSON.stringify(
            backendMessage,
            null,
            2
          )}`
        );

      }

      else {

        alert(
          "Failed to delete resource."
        );

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
          Resource Management
        </h1>


        <button
          onClick={openAddForm}
          style={addBtn}
        >
          + Add Resource
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
          placeholder="🔎 Search by type, name or status..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
          style={searchInput}
        />

      </div>


      {/* =====================================
          RESULT COUNT
      ===================================== */}

      <p
        style={{
          color: "#9ca3af",
          marginBottom: "15px",
        }}
      >
        Showing{" "}
        {filteredResources.length} of{" "}
        {resources.length} resources
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

              <th style={th}>
                ID
              </th>

              <th style={th}>
                Resource Type
              </th>

              <th style={th}>
                Name
              </th>

              <th style={th}>
                Quantity
              </th>

              <th style={th}>
                Status
              </th>

              <th style={th}>
                Latitude
              </th>

              <th style={th}>
                Longitude
              </th>

              <th style={th}>
                Actions
              </th>

            </tr>

          </thead>


          <tbody>

            {filteredResources.length === 0 ? (

              <tr>

                <td
                  colSpan="8"
                  style={{
                    textAlign: "center",
                    padding: "30px",
                    color: "#9ca3af",
                  }}
                >
                  No resources found.
                </td>

              </tr>

            ) : (

              filteredResources.map(
                (resource) => (

                  <tr
                    key={resource.id}
                  >

                    <td style={td}>
                      {resource.id}
                    </td>


                    <td style={td}>
                      {resource.resource_type}
                    </td>


                    <td style={td}>
                      {resource.name}
                    </td>


                    {/* QUANTITY */}

                    <td style={td}>

                      <strong
                        style={{
                          color:
                            Number(resource.quantity) <= 0
                              ? "#ef4444"
                              : Number(resource.quantity) <= 10
                              ? "#f59e0b"
                              : "#22c55e",
                        }}
                      >
                        {resource.quantity ?? 0}
                      </strong>

                    </td>


                    {/* STATUS */}

                    <td style={td}>

                      <span
                        style={{
                          ...statusBadge,
                          background:
                            getStatusColor(
                              resource.status
                            ),
                        }}
                      >
                        {resource.status}
                      </span>

                    </td>


                    <td style={td}>
                      {resource.latitude}
                    </td>


                    <td style={td}>
                      {resource.longitude}
                    </td>


                    {/* ACTIONS */}

                    <td style={td}>

                      <button
                        onClick={() =>
                          openEditForm(
                            resource
                          )
                        }
                        style={editBtn}
                      >
                        Edit
                      </button>


                      <button
                        onClick={() =>
                          handleDelete(
                            resource.id
                          )
                        }
                        style={deleteBtn}
                      >
                        Delete
                      </button>

                    </td>

                  </tr>

                )
              )

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
                  ? "Edit Resource"
                  : "Add New Resource"}
              </h2>


              <button
                onClick={closeForm}
                style={closeBtn}
              >
                ✕
              </button>

            </div>


            {/* FORM */}

            <form
              onSubmit={handleSubmit}
            >

              {/* RESOURCE TYPE */}

              <select
                name="resource_type"
                value={
                  formData.resource_type
                }
                onChange={handleChange}
                style={inputStyle}
              >

                <option value="">
                  Select Resource Type
                </option>

                <option value="Food">
                  Food
                </option>

                <option value="Water">
                  Water
                </option>

                <option value="Medicine">
                  Medicine
                </option>

                <option value="Medical Equipment">
                  Medical Equipment
                </option>

                <option value="Rescue Vehicle">
                  Rescue Vehicle
                </option>

                <option value="Emergency Kit">
                  Emergency Kit
                </option>

                <option value="Other">
                  Other
                </option>

              </select>


              {/* NAME */}

              <input
                name="name"
                style={inputStyle}
                placeholder="Resource Name"
                value={
                  formData.name
                }
                onChange={handleChange}
              />


              {/* QUANTITY */}

              <input
                name="quantity"
                type="number"
                min="0"
                step="1"
                style={inputStyle}
                placeholder="Quantity"
                value={
                  formData.quantity
                }
                onChange={handleChange}
              />


              {/* STATUS */}

              <select
                name="status"
                value={
                  formData.status
                }
                onChange={handleChange}
                style={inputStyle}
              >

                <option value="">
                  Select Status
                </option>

                <option value="Available">
                  Available
                </option>

                <option value="In Use">
                  In Use
                </option>

                <option value="Depleted">
                  Depleted
                </option>

                <option value="Maintenance">
                  Maintenance
                </option>

              </select>


              {/* LATITUDE */}

              <input
                name="latitude"
                type="number"
                step="any"
                style={inputStyle}
                placeholder="Latitude"
                value={
                  formData.latitude
                }
                onChange={handleChange}
              />


              {/* LONGITUDE */}

              <input
                name="longitude"
                type="number"
                step="any"
                style={inputStyle}
                placeholder="Longitude"
                value={
                  formData.longitude
                }
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
                    ? "Update Resource"
                    : "Save Resource"}
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


// =========================================
// STATUS COLOR
// =========================================

const getStatusColor = (
  status
) => {

  const value =
    status
      ?.toLowerCase()
      .trim();


  if (value === "available") {
    return "#16a34a";
  }


  if (value === "in use") {
    return "#2563eb";
  }


  if (value === "depleted") {
    return "#dc2626";
  }


  if (
    value === "maintenance"
  ) {
    return "#f59e0b";
  }


  return "#6b7280";

};


// =========================================
// STYLES
// =========================================

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

  border:
    "1px solid #4b5563",

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

  border:
    "1px solid #4b5563",

  background: "#374151",

  color: "white",

  fontSize: "15px",

  outline: "none",

};


const th = {

  border:
    "1px solid #4b5563",

  padding: "14px",

  background: "#111827",

  fontSize: "15px",

};


const td = {

  border:
    "1px solid #4b5563",

  padding: "14px",

  textAlign: "center",

};


const statusBadge = {

  display: "inline-block",

  color: "white",

  padding: "6px 12px",

  borderRadius: "20px",

  fontSize: "13px",

  fontWeight: "bold",

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

  background:
    "rgba(0, 0, 0, 0.7)",

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


export default Resources;