import { useEffect, useState } from "react";
import DisasterMap from "../components/DisasterMap";

import { getDisasters } from "../services/disasterService";
import { getShelters } from "../services/shelterService";
import { getResources } from "../services/resourceService";

import RiskAnalysis from "../components/RiskAnalysis";

import "../styles/dashboard.css";

function Dashboard() {
  const [disasters, setDisasters] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD DASHBOARD DATA
  // =========================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const [disasterData, shelterData, resourceData] =
        await Promise.all([
          getDisasters(),
          getShelters(),
          getResources(),
        ]);

      setDisasters(Array.isArray(disasterData) ? disasterData : []);
      setShelters(Array.isArray(shelterData) ? shelterData : []);
      setResources(Array.isArray(resourceData) ? resourceData : []);
    } catch (error) {
      console.error("Failed to load dashboard:", error);

      setDisasters([]);
      setShelters([]);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // HIGH SEVERITY DISASTERS
  // =========================================

  const highSeverityDisasters = disasters.filter(
    (d) =>
      String(d.severity || "")
        .toLowerCase()
        .trim() === "high"
  );

  // =========================================
  // RECENT DISASTERS
  // =========================================

  const recentDisasters = [...disasters]
    .reverse()
    .slice(0, 5);

  // =========================================
  // PREPARE DATA FOR AI RISK ANALYSIS
  // =========================================
  //
  // Backend uses "disaster_type".
  // RiskAnalysis expects "type".
  //
  // So we normalize the data here.
  // =========================================

  const riskAnalysisDisasters = disasters.map((disaster) => ({
    ...disaster,
    type:
      disaster.type ||
      disaster.disaster_type ||
      "Unknown Disaster",
  }));

  // =========================================
  // SHELTER CAPACITY
  // =========================================

  const totalCapacity = shelters.reduce(
    (total, shelter) =>
      total + Number(shelter.capacity || 0),
    0
  );

  const currentOccupancy = shelters.reduce(
    (total, shelter) =>
      total +
      Number(shelter.current_occupancy || 0),
    0
  );

  // =========================================
  // RESOURCE STATUS
  // =========================================

  const availableResources = resources.filter(
    (resource) =>
      String(resource.status || "")
        .toLowerCase()
        .trim() === "available"
  ).length;

  // =========================================
  // LOADING SCREEN
  // =========================================

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111827",
          color: "white",
          padding: "100px 35px",
          textAlign: "center",
        }}
      >
        <h2>
          Loading Disaster Response Dashboard...
        </h2>

        <p
          style={{
            color: "#9ca3af",
          }}
        >
          Fetching latest system data
        </p>
      </div>
    );
  }

  // =========================================
  // UI
  // =========================================

  return (
    <div
      style={{
        padding: "35px",
        marginTop: "70px",
        background: "#111827",
        minHeight: "100vh",
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
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <div>
          <h1 className="dashboard-title">
            Disaster Response Dashboard
          </h1>

          <p
            style={{
              color: "#9ca3af",
              marginTop: "5px",
            }}
          >
            Real-time overview of disaster response
            operations
          </p>
        </div>

        <button
          onClick={loadDashboard}
          style={{
            background: "#2563eb",
            color: "white",
            border: "none",
            padding: "11px 18px",
            borderRadius: "7px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ↻ Refresh Data
        </button>
      </div>

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div className="card-container">

        {/* DISASTERS */}

        <div className="dashboard-card">
          <h3>🚨 Total Disasters</h3>

          <h1>
            {disasters.length}
          </h1>

          <p
            style={{
              color: "#9ca3af",
            }}
          >
            Reported incidents
          </p>
        </div>

        {/* SHELTERS */}

        <div className="dashboard-card">
          <h3>🏠 Total Shelters</h3>

          <h1>
            {shelters.length}
          </h1>

          <p
            style={{
              color: "#9ca3af",
            }}
          >
            Emergency shelters
          </p>
        </div>

        {/* RESOURCES */}

        <div className="dashboard-card">
          <h3>🚑 Total Resources</h3>

          <h1>
            {resources.length}
          </h1>

          <p
            style={{
              color: "#9ca3af",
            }}
          >
            Registered resources
          </p>
        </div>

        {/* HIGH SEVERITY */}

        <div
          className="dashboard-card"
          style={{
            borderTop: "4px solid #ef4444",
          }}
        >
          <h3>⚠️ High Severity</h3>

          <h1
            style={{
              color:
                highSeverityDisasters.length > 0
                  ? "#ef4444"
                  : "#22c55e",
            }}
          >
            {highSeverityDisasters.length}
          </h1>

          <p
            style={{
              color: "#9ca3af",
            }}
          >
            Critical incidents
          </p>
        </div>
      </div>

      {/* =====================================
          QUICK STATUS
      ===================================== */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "25px",
        }}
      >

        {/* SHELTER CAPACITY */}

        <div style={quickCard}>
          <div
            style={{
              fontSize: "25px",
            }}
          >
            👥
          </div>

          <div>
            <h3
              style={{
                margin: 0,
              }}
            >
              Shelter Capacity
            </h3>

            <p
              style={{
                margin: "7px 0 0",
                color: "#9ca3af",
              }}
            >
              {currentOccupancy} occupied /{" "}
              {totalCapacity} capacity
            </p>
          </div>
        </div>

        {/* AVAILABLE RESOURCES */}

        <div style={quickCard}>
          <div
            style={{
              fontSize: "25px",
            }}
          >
            📦
          </div>

          <div>
            <h3
              style={{
                margin: 0,
              }}
            >
              Available Resources
            </h3>

            <p
              style={{
                margin: "7px 0 0",
                color: "#9ca3af",
              }}
            >
              {availableResources} currently available
            </p>
          </div>
        </div>

        {/* ALERT STATUS */}

        <div
          style={{
            ...quickCard,
            borderLeft:
              highSeverityDisasters.length > 0
                ? "4px solid #ef4444"
                : "4px solid #22c55e",
          }}
        >
          <div
            style={{
              fontSize: "25px",
            }}
          >
            {highSeverityDisasters.length > 0
              ? "🔴"
              : "🟢"}
          </div>

          <div>
            <h3
              style={{
                margin: 0,
              }}
            >
              System Status
            </h3>

            <p
              style={{
                margin: "7px 0 0",
                color:
                  highSeverityDisasters.length > 0
                    ? "#ef4444"
                    : "#22c55e",
              }}
            >
              {highSeverityDisasters.length > 0
                ? "High severity incidents detected"
                : "No high severity alerts"}
            </p>
          </div>
        </div>
      </div>

      {/* =====================================
          HIGH SEVERITY ALERT
      ===================================== */}

      {highSeverityDisasters.length > 0 && (
        <div
          style={{
            marginTop: "30px",
            background: "rgba(127, 29, 29, 0.35)",
            border: "1px solid #991b1b",
            borderLeft: "5px solid #ef4444",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: "#f87171",
            }}
          >
            ⚠️ High Severity Alerts
          </h2>

          <p
            style={{
              color: "#d1d5db",
            }}
          >
            There are{" "}
            <strong>
              {highSeverityDisasters.length}
            </strong>{" "}
            high-severity disaster
            {highSeverityDisasters.length !== 1
              ? "s"
              : ""}{" "}
            requiring attention.
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            {highSeverityDisasters
              .slice(0, 3)
              .map((disaster) => (
                <div
                  key={disaster.id}
                  style={{
                    background: "#1f2937",
                    padding: "12px 15px",
                    borderRadius: "7px",
                  }}
                >
                  🚨{" "}
                  <strong>
                    {disaster.disaster_type ||
                      disaster.type ||
                      "Unknown Disaster"}
                  </strong>

                  {" — "}

                  {disaster.location || "Unknown location"}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* =====================================
          RECENT DISASTERS
      ===================================== */}

      <h2 className="section-title">
        🚨 Recent Disasters
      </h2>

      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table className="dashboard-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Type</th>
              <th>Location</th>
              <th>Severity</th>
            </tr>
          </thead>

          <tbody>
            {recentDisasters.length === 0 ? (
              <tr>
                <td
                  colSpan="4"
                  style={{
                    textAlign: "center",
                    padding: "25px",
                    color: "#9ca3af",
                  }}
                >
                  No disasters reported.
                </td>
              </tr>
            ) : (
              recentDisasters.map((disaster) => (
                <tr key={disaster.id}>
                  <td>
                    {disaster.id}
                  </td>

                  <td>
                    {disaster.disaster_type ||
                      disaster.type ||
                      "Unknown"}
                  </td>

                  <td>
                    {disaster.location ||
                      "Unknown"}
                  </td>

                  <td>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "5px 10px",
                        borderRadius: "15px",
                        background:
                          getSeverityColor(
                            disaster.severity
                          ),
                        color: "white",
                        fontSize: "13px",
                        fontWeight: "bold",
                      }}
                    >
                      {disaster.severity ||
                        "Unknown"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* =====================================
          🤖 AI RISK ANALYSIS
      ===================================== */}

      <RiskAnalysis
        disasters={riskAnalysisDisasters}
      />

      {/* =====================================
          LIVE MAP
      ===================================== */}

      <h2 className="section-title">
        🗺 Live Disaster Map
      </h2>

      <div
        style={{
          borderRadius: "12px",
          overflow: "hidden",
          boxShadow:
            "0 5px 20px rgba(0,0,0,0.3)",
        }}
      >
        <DisasterMap
          disasters={disasters}
          shelters={shelters}
          resources={resources}
        />
      </div>
    </div>
  );
}

// =========================================
// SEVERITY COLOR
// =========================================

const getSeverityColor = (severity) => {
  const value = String(severity || "")
    .toLowerCase()
    .trim();

  if (value === "high") {
    return "#dc2626";
  }

  if (value === "medium") {
    return "#f59e0b";
  }

  if (value === "low") {
    return "#16a34a";
  }

  return "#6b7280";
};

// =========================================
// QUICK CARD STYLE
// =========================================

const quickCard = {
  background: "#1f2937",
  padding: "18px",
  borderRadius: "10px",
  display: "flex",
  alignItems: "center",
  gap: "15px",
};

export default Dashboard;