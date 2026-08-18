import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { getDisasters } from "../services/disasterService";
import { getShelters } from "../services/shelterService";
import { getResources } from "../services/resourceService";

function Analytics() {
  const [disasters, setDisasters] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  // =========================================
  // LOAD ALL DATA
  // =========================================

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const [
        disasterData,
        shelterData,
        resourceData,
      ] = await Promise.all([
        getDisasters(),
        getShelters(),
        getResources(),
      ]);

      setDisasters(disasterData);
      setShelters(shelterData);
      setResources(resourceData);

    } catch (error) {
      console.error(
        "Failed to load analytics:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {
    return (
      <div style={pageStyle}>
        <h1>Analytics</h1>

        <p style={{ color: "#9ca3af" }}>
          Loading analytics...
        </p>
      </div>
    );
  }

  // =========================================
  // DISASTER SEVERITY
  // =========================================

  const severityData = [
    {
      name: "Low",
      value: disasters.filter(
        (d) =>
          d.severity?.toLowerCase() ===
          "low"
      ).length,
    },

    {
      name: "Medium",
      value: disasters.filter(
        (d) =>
          d.severity?.toLowerCase() ===
          "medium"
      ).length,
    },

    {
      name: "High",
      value: disasters.filter(
        (d) =>
          d.severity?.toLowerCase() ===
          "high"
      ).length,
    },
  ];

  // =========================================
  // DISASTER TYPE
  // =========================================

  const disasterTypeMap = {};

  disasters.forEach((disaster) => {
    const type =
      disaster.disaster_type ||
      "Unknown";

    disasterTypeMap[type] =
      (disasterTypeMap[type] || 0) + 1;
  });

  const disasterTypeData =
    Object.entries(
      disasterTypeMap
    ).map(([name, value]) => ({
      name,
      value,
    }));

  // =========================================
  // RESOURCE STATUS
  // =========================================

  const resourceStatusMap = {};

  resources.forEach((resource) => {
    const status =
      resource.status ||
      "Unknown";

    resourceStatusMap[status] =
      (resourceStatusMap[status] || 0) + 1;
  });

  const resourceStatusData =
    Object.entries(
      resourceStatusMap
    ).map(([name, value]) => ({
      name,
      value,
    }));

  // =========================================
  // SHELTER CAPACITY
  // =========================================

  const totalShelterCapacity =
    shelters.reduce(
      (total, shelter) =>
        total +
        Number(shelter.capacity || 0),
      0
    );

  // =========================================
  // CHART COLORS
  // =========================================

  const severityColors = [
    "#22c55e",
    "#f59e0b",
    "#ef4444",
  ];

  const chartColors = [
    "#3b82f6",
    "#8b5cf6",
    "#06b6d4",
    "#f59e0b",
    "#ef4444",
    "#22c55e",
  ];

  // =========================================
  // UI
  // =========================================

  return (
    <div style={pageStyle}>

      {/* =====================================
          HEADER
      ===================================== */}

      <div style={headerStyle}>

        <div>
          <h1 style={titleStyle}>
            Analytics Dashboard
          </h1>

          <p style={subtitleStyle}>
            Disaster response overview
            and statistics
          </p>
        </div>

        <button
          onClick={loadAnalytics}
          style={refreshButton}
        >
          ↻ Refresh Data
        </button>

      </div>

      {/* =====================================
          SUMMARY CARDS
      ===================================== */}

      <div style={cardsContainer}>

        {/* DISASTERS */}

        <div
          style={{
            ...cardStyle,
            borderTop:
              "4px solid #ef4444",
          }}
        >
          <div style={cardIcon}>
            🚨
          </div>

          <div>
            <h2 style={cardNumber}>
              {disasters.length}
            </h2>

            <p style={cardLabel}>
              Total Disasters
            </p>
          </div>
        </div>

        {/* SHELTERS */}

        <div
          style={{
            ...cardStyle,
            borderTop:
              "4px solid #22c55e",
          }}
        >
          <div style={cardIcon}>
            🏠
          </div>

          <div>
            <h2 style={cardNumber}>
              {shelters.length}
            </h2>

            <p style={cardLabel}>
              Total Shelters
            </p>
          </div>
        </div>

        {/* RESOURCES */}

        <div
          style={{
            ...cardStyle,
            borderTop:
              "4px solid #3b82f6",
          }}
        >
          <div style={cardIcon}>
            🚑
          </div>

          <div>
            <h2 style={cardNumber}>
              {resources.length}
            </h2>

            <p style={cardLabel}>
              Total Resources
            </p>
          </div>
        </div>

        {/* CAPACITY */}

        <div
          style={{
            ...cardStyle,
            borderTop:
              "4px solid #a855f7",
          }}
        >
          <div style={cardIcon}>
            👥
          </div>

          <div>
            <h2 style={cardNumber}>
              {totalShelterCapacity}
            </h2>

            <p style={cardLabel}>
              Shelter Capacity
            </p>
          </div>
        </div>

      </div>

      {/* =====================================
          CHARTS ROW 1
      ===================================== */}

      <div style={chartsGrid}>

        {/* SEVERITY CHART */}

        <div style={chartCard}>

          <h2 style={chartTitle}>
            Disaster Severity
          </h2>

          <p style={chartSubtitle}>
            Distribution by severity level
          </p>

          <div style={chartContainer}>

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={severityData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >

                  {severityData.map(
                    (entry, index) => (
                      <Cell
                        key={`severity-${index}`}
                        fill={
                          severityColors[
                            index
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* DISASTER TYPES */}

        <div style={chartCard}>

          <h2 style={chartTitle}>
            Disaster Types
          </h2>

          <p style={chartSubtitle}>
            Number of disasters by type
          </p>

          <div style={chartContainer}>

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  disasterTypeData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                />

                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                />

                <YAxis
                  allowDecimals={false}
                  stroke="#9ca3af"
                />

                <Tooltip />

                <Legend />

                <Bar
                  dataKey="value"
                  name="Disasters"
                  fill="#3b82f6"
                  radius={[
                    5,
                    5,
                    0,
                    0,
                  ]}
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>

      {/* =====================================
          CHARTS ROW 2
      ===================================== */}

      <div style={chartsGrid}>

        {/* RESOURCE STATUS */}

        <div style={chartCard}>

          <h2 style={chartTitle}>
            Resource Status
          </h2>

          <p style={chartSubtitle}>
            Current resource availability
          </p>

          <div style={chartContainer}>

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <PieChart>

                <Pie
                  data={
                    resourceStatusData
                  }
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >

                  {resourceStatusData.map(
                    (entry, index) => (
                      <Cell
                        key={`resource-${index}`}
                        fill={
                          chartColors[
                            index %
                              chartColors.length
                          ]
                        }
                      />
                    )
                  )}

                </Pie>

                <Tooltip />

                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* QUICK STATISTICS */}

        <div style={chartCard}>

          <h2 style={chartTitle}>
            Quick Statistics
          </h2>

          <p style={chartSubtitle}>
            Current system overview
          </p>

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "18px",
              marginTop: "25px",
            }}
          >

            {/* HIGH SEVERITY */}

            <div
              style={statRow}
            >

              <span>
                🔴 High Severity
              </span>

              <strong>
                {
                  severityData.find(
                    (item) =>
                      item.name ===
                      "High"
                  )?.value || 0
                }
              </strong>

            </div>

            {/* MEDIUM */}

            <div
              style={statRow}
            >

              <span>
                🟡 Medium Severity
              </span>

              <strong>
                {
                  severityData.find(
                    (item) =>
                      item.name ===
                      "Medium"
                  )?.value || 0
                }
              </strong>

            </div>

            {/* LOW */}

            <div
              style={statRow}
            >

              <span>
                🟢 Low Severity
              </span>

              <strong>
                {
                  severityData.find(
                    (item) =>
                      item.name ===
                      "Low"
                  )?.value || 0
                }
              </strong>

            </div>

            {/* SHELTER */}

            <div
              style={statRow}
            >

              <span>
                🏠 Shelter Capacity
              </span>

              <strong>
                {totalShelterCapacity}
              </strong>

            </div>

            {/* RESOURCE */}

            <div
              style={statRow}
            >

              <span>
                🚑 Resources
              </span>

              <strong>
                {resources.length}
              </strong>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

// =========================================
// STYLES
// =========================================

const pageStyle = {
  minHeight: "100vh",
  padding: "40px",
  background: "#111827",
  color: "white",
  boxSizing: "border-box",
};

const headerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "35px",
};

const titleStyle = {
  fontSize: "38px",
  margin: 0,
};

const subtitleStyle = {
  color: "#9ca3af",
  marginTop: "8px",
};

const refreshButton = {
  background: "#2563eb",
  color: "white",
  border: "none",
  padding: "11px 18px",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "bold",
};

const cardsContainer = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "20px",
  marginBottom: "30px",
};

const cardStyle = {
  background: "#1f2937",
  borderRadius: "10px",
  padding: "22px",
  display: "flex",
  alignItems: "center",
  gap: "18px",
  boxSizing: "border-box",
};

const cardIcon = {
  fontSize: "35px",
};

const cardNumber = {
  fontSize: "30px",
  margin: 0,
};

const cardLabel = {
  color: "#9ca3af",
  margin: "5px 0 0",
};

const chartsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(400px, 1fr))",
  gap: "25px",
  marginBottom: "25px",
};

const chartCard = {
  background: "#1f2937",
  borderRadius: "10px",
  padding: "25px",
  minWidth: 0,
};

const chartTitle = {
  margin: 0,
  fontSize: "22px",
};

const chartSubtitle = {
  color: "#9ca3af",
  marginTop: "6px",
};

const chartContainer = {
  width: "100%",
  height: "330px",
  marginTop: "15px",
};

const statRow = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "15px",
  background: "#111827",
  borderRadius: "8px",
  color: "#d1d5db",
};

export default Analytics;