import { useEffect, useState } from "react";
import { analyzeDisasterDecision } from "../utils/decisionEngine";

const API_BASE = "http://127.0.0.1:8000";

const toNumber = (value) => {
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

const distanceKm = (lat1, lon1, lat2, lon2) => {
  const aLat = toNumber(lat1);
  const aLon = toNumber(lon1);
  const bLat = toNumber(lat2);
  const bLon = toNumber(lon2);

  if (aLat === null || aLon === null || bLat === null || bLon === null) return null;

  const earthRadius = 6371;
  const dLat = ((bLat - aLat) * Math.PI) / 180;
  const dLon = ((bLon - aLon) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos((aLat * Math.PI) / 180) * Math.cos((bLat * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
};

const getLogisticsForDisaster = (disaster, resources, shelters) => {
  const disasterLat = toNumber(disaster.latitude);
  const disasterLon = toNumber(disaster.longitude);

  if (disasterLat === null || disasterLon === null) {
    return { resources: [], shelter: null, hasLocation: false };
  }

  const nearbyResources = resources
    .filter((resource) => String(resource.status || "").toLowerCase() === "available" && Number(resource.quantity || 0) > 0)
    .map((resource) => ({ ...resource, distance: distanceKm(disasterLat, disasterLon, resource.latitude, resource.longitude) }))
    .filter((resource) => resource.distance !== null)
    .sort((a, b) => a.distance - b.distance);

  const nearbyShelters = shelters
    .map((shelter) => {
      const capacity = Number(shelter.capacity || 0);
      const occupancy = Number(shelter.current_occupancy || 0);
      return {
        ...shelter,
        availableCapacity: Math.max(capacity - occupancy, 0),
        distance: distanceKm(disasterLat, disasterLon, shelter.latitude, shelter.longitude),
      };
    })
    .filter((shelter) => shelter.distance !== null && shelter.availableCapacity > 0)
    .sort((a, b) => a.distance - b.distance);

  return { resources: nearbyResources.slice(0, 4), shelter: nearbyShelters[0] || null, hasLocation: true };
};

const getResourceAllocation = (analysis, logistics) => {
  const riskFactors = {
    Critical: 0.60,
    High: 0.40,
    Medium: 0.25,
    Low: 0.10,
  };

  const factor = riskFactors[analysis.riskLevel] || 0.10;

  const allocations = logistics.resources.map((resource) => {
    const quantity = Number(resource.quantity || 0);

    // Prefer closer resources, while keeping a conservative inventory reserve.
    const distanceFactor =
      resource.distance <= 5
        ? 1
        : resource.distance <= 15
        ? 0.85
        : 0.70;

    const recommended = Math.min(
      quantity,
      Math.max(
        1,
        Math.ceil(quantity * factor * distanceFactor)
      )
    );

    return {
      ...resource,
      recommended,
      remaining: quantity - recommended,
    };
  });

  const shelter = logistics.shelter;

  let shelterRecommendation = null;

  if (shelter) {
    const availableCapacity = Number(
      shelter.availableCapacity || 0
    );

    shelterRecommendation = {
      ...shelter,
      recommendedCapacity: Math.min(
        availableCapacity,
        analysis.riskLevel === "Critical"
          ? Math.ceil(availableCapacity * 0.75)
          : analysis.riskLevel === "High"
          ? Math.ceil(availableCapacity * 0.60)
          : analysis.riskLevel === "Medium"
          ? Math.ceil(availableCapacity * 0.40)
          : Math.ceil(availableCapacity * 0.25)
      ),
    };
  }

  const reason =
    analysis.riskLevel === "Critical"
      ? "Critical risk: prioritize immediate deployment while keeping part of the inventory in reserve."
      : analysis.riskLevel === "High"
      ? "High risk: deploy a substantial portion of nearby resources and keep reserve stock available."
      : analysis.riskLevel === "Medium"
      ? "Medium risk: use a controlled deployment and preserve most inventory for escalation."
      : "Low risk: use a small initial deployment and retain inventory for changing conditions.";

  return {
    allocations,
    shelter: shelterRecommendation,
    reason,
  };
};

function AIManagement() {
  const [disasters, setDisasters] = useState([]);
  const [resources, setResources] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDisasters = async () => {
    try {
      setLoading(true);
      setError("");

      const [disasterResponse, resourceResponse, shelterResponse] = await Promise.all([
        fetch(`${API_BASE}/disasters`),
        fetch(`${API_BASE}/resources`),
        fetch(`${API_BASE}/shelters`),
      ]);

      if (!disasterResponse.ok) throw new Error("Failed to fetch disasters");
      if (!resourceResponse.ok) throw new Error("Failed to fetch resources");
      if (!shelterResponse.ok) throw new Error("Failed to fetch shelters");

      const [disasterData, resourceData, shelterData] = await Promise.all([
        disasterResponse.json(),
        resourceResponse.json(),
        shelterResponse.json(),
      ]);

      setDisasters(Array.isArray(disasterData) ? disasterData : []);
      setResources(Array.isArray(resourceData) ? resourceData : []);
      setShelters(Array.isArray(shelterData) ? shelterData : []);
    } catch (err) {
      console.error(err);
      setError("Unable to load disaster data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDisasters();
  }, []);

  const getRiskClass = (level) => {
    if (level === "Critical") return "critical";
    if (level === "High") return "high";
    if (level === "Medium") return "medium";
    return "low";
  };

  if (loading) {
    return (
      <div style={styles.page}>
        <h1>🤖 AI Management System</h1>
        <p style={styles.subtitle}>
          AI-powered disaster risk and response management
        </p>

        <div style={styles.loading}>
          Loading AI analysis...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <h1>🤖 AI Management System</h1>

        <div style={styles.error}>
          {error}
        </div>

        <button
          onClick={loadDisasters}
          style={styles.refreshButton}
        >
          🔄 Retry
        </button>
      </div>
    );
  }

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>
            🤖 AI Management System
          </h1>

          <p style={styles.subtitle}>
            AI-powered disaster risk assessment and response planning
          </p>
        </div>

        <button
          onClick={loadDisasters}
          style={styles.refreshButton}
        >
          🔄 Refresh Analysis
        </button>
      </div>


      {/* SUMMARY */}
      <div style={styles.summaryGrid}>

        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🚨</div>

          <div>
            <div style={styles.summaryLabel}>
              Total Disasters
            </div>

            <div style={styles.summaryValue}>
              {disasters.length}
            </div>
          </div>
        </div>


        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🔴</div>

          <div>
            <div style={styles.summaryLabel}>
              Critical
            </div>

            <div style={{ ...styles.summaryValue, color: "#ff4d4d" }}>
              {
                disasters.filter(
                  (disaster) =>
                    analyzeDisasterDecision(disaster).riskLevel ===
                    "Critical"
                ).length
              }
            </div>
          </div>
        </div>


        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>🟠</div>

          <div>
            <div style={styles.summaryLabel}>
              High Risk
            </div>

            <div style={{ ...styles.summaryValue, color: "#ff8a00" }}>
              {
                disasters.filter(
                  (disaster) =>
                    analyzeDisasterDecision(disaster).riskLevel ===
                    "High"
                ).length
              }
            </div>
          </div>
        </div>


        <div style={styles.summaryCard}>
          <div style={styles.summaryIcon}>⚡</div>

          <div>
            <div style={styles.summaryLabel}>
              Immediate Response
            </div>

            <div style={styles.summaryValue}>
              {
                disasters.filter(
                  (disaster) =>
                    analyzeDisasterDecision(disaster).priority ===
                    "Immediate"
                ).length
              }
            </div>
          </div>
        </div>

      </div>


      {/* AI ANALYSIS */}
      <div style={styles.section}>

        <div style={styles.sectionHeader}>
          <div>
            <h2 style={styles.sectionTitle}>
              🧠 AI Disaster Analysis
            </h2>

            <p style={styles.sectionSubtitle}>
              Automated risk assessment and recommended response actions
            </p>
          </div>
        </div>


        {disasters.length === 0 ? (

          <div style={styles.empty}>
            <div style={{ fontSize: "45px" }}>📭</div>

            <h3>No disasters found</h3>

            <p>
              There are currently no disaster reports available
              for AI analysis.
            </p>
          </div>

        ) : (

          <div style={styles.cardsGrid}>

            {disasters.map((disaster) => {

              const analysis =
                analyzeDisasterDecision(disaster);

              const riskClass =
                getRiskClass(analysis.riskLevel);

              const logistics = getLogisticsForDisaster(
                disaster,
                resources,
                shelters
              );

              const allocation = getResourceAllocation(
                analysis,
                logistics
              );

              return (

                <div
                  key={disaster.id}
                  style={styles.aiCard}
                >

                  {/* CARD HEADER */}
                  <div style={styles.cardHeader}>

                    <div>
                      <h3 style={styles.disasterTitle}>
                        {disaster.disaster_type}
                      </h3>

                      <div style={styles.location}>
                        📍 {disaster.location}
                      </div>
                    </div>

                    <div
                      style={{
                        ...styles.riskBadge,
                        ...(riskStyles[riskClass] || {}),
                      }}
                    >
                      {analysis.riskLevel}
                    </div>

                  </div>


                  {/* RISK SCORE */}
                  <div style={styles.scoreSection}>

                    <div style={styles.scoreHeader}>
                      <span>AI Risk Score</span>

                      <strong>
                        {analysis.riskScore}/100
                      </strong>
                    </div>

                    <div style={styles.progressBackground}>
                      <div
                        style={{
                          ...styles.progress,
                          width: `${analysis.riskScore}%`,
                          ...(riskStyles[riskClass] || {}),
                        }}
                      />
                    </div>

                  </div>


                  {/* ORIGINAL SEVERITY */}
                  <div style={styles.infoRow}>

                    <div>
                      <span style={styles.infoLabel}>
                        Reported Severity
                      </span>

                      <strong>
                        {disaster.severity}
                      </strong>
                    </div>

                    <div>
                      <span style={styles.infoLabel}>
                        Priority
                      </span>

                      <strong>
                        {analysis.priority}
                      </strong>
                    </div>

                  </div>


                  {/* PRIORITY MESSAGE */}
                  <div style={styles.priorityBox}>

                    <strong>
                      ⚡ AI Decision
                    </strong>

                    <p>
                      {analysis.priorityMessage}
                    </p>

                  </div>


                  {/* RECOMMENDED ACTIONS */}
                  <div style={styles.listSection}>

                    <h4>
                      📋 Recommended Actions
                    </h4>

                    <ul>
                      {analysis.recommendedActions.map(
                        (action, index) => (
                          <li key={index}>
                            {action}
                          </li>
                        )
                      )}
                    </ul>

                  </div>


                  {/* RESOURCES */}
                  <div style={styles.listSection}>

                    <h4>
                      📦 Required Resources
                    </h4>

                    <ul>
                      {analysis.resourcePriorities.map(
                        (resource, index) => (
                          <li key={index}>
                            {resource}
                          </li>
                        )
                      )}
                    </ul>

                  </div>


                  {/* RESOURCE AVAILABILITY */}
                  <div style={styles.listSection}>
                    <h4>🚑 Nearby Available Resources</h4>

                    {!logistics.hasLocation ? (
                      <div style={styles.noData}>
                        Disaster coordinates are not available.
                      </div>
                    ) : logistics.resources.length === 0 ? (
                      <div style={styles.noData}>
                        No available resource with quantity greater than 0 was found.
                      </div>
                    ) : (
                      <div style={styles.resourceList}>
                        {logistics.resources.map((resource) => (
                          <div key={resource.id} style={styles.resourceItem}>
                            <div>
                              <strong>{resource.name}</strong>
                              <div style={styles.resourceMeta}>{resource.resource_type}</div>
                            </div>
                            <div style={styles.resourceStats}>
                              <span>📦 {Number(resource.quantity || 0)} available</span>
                              <span>📍 {resource.distance.toFixed(1)} km</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* NEAREST SHELTER */}
                  <div style={styles.listSection}>
                    <h4>🏠 Nearest Available Shelter</h4>

                    {!logistics.hasLocation ? (
                      <div style={styles.noData}>
                        Disaster coordinates are not available.
                      </div>
                    ) : !logistics.shelter ? (
                      <div style={styles.noData}>
                        No shelter with available capacity was found.
                      </div>
                    ) : (
                      <div style={styles.shelterBox}>
                        <div>
                          <strong>{logistics.shelter.name}</strong>
                          <div style={styles.resourceMeta}>
                            {logistics.shelter.address || logistics.shelter.location || "Shelter location"}
                          </div>
                        </div>
                        <div style={styles.shelterStats}>
                          <span>🛏️ {logistics.shelter.availableCapacity} spaces</span>
                          <span>📍 {logistics.shelter.distance.toFixed(1)} km</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* AI RESOURCE ALLOCATION */}
                  <div style={styles.listSection}>
                    <h4>🧠 AI Resource Allocation</h4>

                    <div style={styles.allocationReason}>
                      <strong>Recommendation:</strong>
                      <p>{allocation.reason}</p>
                    </div>

                    {allocation.allocations.length === 0 ? (
                      <div style={styles.noData}>
                        No available resource can be allocated for this disaster.
                      </div>
                    ) : (
                      <div style={styles.resourceList}>
                        {allocation.allocations.map((resource) => (
                          <div
                            key={`allocation-${resource.id}`}
                            style={styles.allocationItem}
                          >
                            <div>
                              <strong>{resource.name}</strong>
                              <div style={styles.resourceMeta}>
                                {resource.resource_type} · {resource.distance.toFixed(1)} km away
                              </div>
                            </div>

                            <div style={styles.allocationStats}>
                              <span>
                                Available: {Number(resource.quantity || 0)}
                              </span>
                              <strong>
                                Deploy: {resource.recommended}
                              </strong>
                              <span>
                                Reserve: {resource.remaining}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {allocation.shelter ? (
                      <div style={styles.allocationShelter}>
                        <div>
                          <strong>🏠 Shelter Recommendation</strong>
                          <div style={styles.resourceMeta}>
                            {allocation.shelter.name} · {allocation.shelter.distance.toFixed(1)} km away
                          </div>
                        </div>

                        <div style={styles.allocationStats}>
                          <span>
                            Available: {allocation.shelter.availableCapacity}
                          </span>
                          <strong>
                            Reserve: {allocation.shelter.recommendedCapacity} spaces
                          </strong>
                        </div>
                      </div>
                    ) : (
                      <div style={styles.noData}>
                        No shelter with available capacity was found.
                      </div>
                    )}
                  </div>

                  {/* RESPONSE TEAMS */}
                  <div style={styles.listSection}>

                    <h4>
                      👥 Response Teams
                    </h4>

                    <div style={styles.teamContainer}>

                      {analysis.responseTeams.map(
                        (team, index) => (
                          <span
                            key={index}
                            style={styles.teamTag}
                          >
                            {team}
                          </span>
                        )
                      )}

                    </div>

                  </div>

                </div>

              );
            })}

          </div>

        )}

      </div>

    </div>
  );
}


// =====================================================
// STYLES
// =====================================================

const styles = {

  page: {
    padding: "35px",
    color: "#ffffff",
    minHeight: "100vh",
    background: "#101827",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },

  title: {
    fontSize: "34px",
    margin: 0,
  },

  subtitle: {
    color: "#9caec8",
    fontSize: "16px",
    marginTop: "8px",
  },

  refreshButton: {
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    background: "#2563eb",
    color: "#ffffff",
    fontWeight: "bold",
    cursor: "pointer",
  },

  summaryGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "18px",
    marginBottom: "35px",
  },

  summaryCard: {
    background: "#1f2937",
    border: "1px solid #344156",
    borderRadius: "12px",
    padding: "22px",
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },

  summaryIcon: {
    fontSize: "30px",
  },

  summaryLabel: {
    color: "#9caec8",
    fontSize: "14px",
  },

  summaryValue: {
    fontSize: "28px",
    fontWeight: "bold",
    marginTop: "4px",
    color: "#60a5fa",
  },

  section: {
    background: "#1f2937",
    border: "1px solid #344156",
    borderRadius: "14px",
    padding: "25px",
  },

  sectionHeader: {
    marginBottom: "25px",
  },

  sectionTitle: {
    margin: 0,
    fontSize: "25px",
  },

  sectionSubtitle: {
    color: "#9caec8",
    marginTop: "6px",
  },

  cardsGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(330px, 1fr))",
    gap: "20px",
  },

  aiCard: {
    background: "#111827",
    border: "1px solid #344156",
    borderRadius: "12px",
    padding: "20px",
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "10px",
  },

  disasterTitle: {
    margin: 0,
    fontSize: "20px",
  },

  location: {
    color: "#9caec8",
    marginTop: "7px",
    fontSize: "14px",
  },

  riskBadge: {
    padding: "7px 13px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "bold",
    color: "#ffffff",
  },

  scoreSection: {
    marginTop: "25px",
  },

  scoreHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "8px",
    color: "#cbd5e1",
  },

  progressBackground: {
    height: "9px",
    background: "#374151",
    borderRadius: "10px",
    overflow: "hidden",
  },

  progress: {
    height: "100%",
    borderRadius: "10px",
  },

  infoRow: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "15px",
    marginTop: "22px",
    paddingTop: "18px",
    borderTop: "1px solid #293548",
  },

  infoLabel: {
    display: "block",
    color: "#7183a1",
    fontSize: "12px",
    marginBottom: "5px",
  },

  priorityBox: {
    marginTop: "20px",
    padding: "14px",
    background: "#182235",
    borderRadius: "8px",
    borderLeft: "4px solid #60a5fa",
  },

  listSection: {
    marginTop: "20px",
  },


  teamContainer: {
    display: "flex",
    flexWrap: "wrap",
    gap: "8px",
  },

  teamTag: {
    padding: "7px 10px",
    background: "#1e3a5f",
    color: "#93c5fd",
    borderRadius: "6px",
    fontSize: "12px",
  },

  resourceList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  resourceItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#182235",
    border: "1px solid #293548",
    borderRadius: "8px",
  },

  resourceMeta: {
    color: "#7183a1",
    fontSize: "12px",
    marginTop: "4px",
  },

  resourceStats: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
    color: "#cbd5e1",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  shelterBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "14px",
    background: "#182235",
    border: "1px solid #293548",
    borderRadius: "8px",
  },

  shelterStats: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
    color: "#cbd5e1",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  noData: {
    padding: "12px",
    background: "#182235",
    borderRadius: "8px",
    color: "#9caec8",
    fontSize: "13px",
  },

  allocationReason: {
    padding: "12px",
    background: "#172554",
    border: "1px solid #1e40af",
    borderRadius: "8px",
    color: "#dbeafe",
    fontSize: "13px",
  },

  allocationItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    padding: "12px",
    background: "#182235",
    border: "1px solid #293548",
    borderRadius: "8px",
  },

  allocationStats: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "4px",
    color: "#cbd5e1",
    fontSize: "12px",
    whiteSpace: "nowrap",
  },

  allocationShelter: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    marginTop: "10px",
    padding: "14px",
    background: "#14281f",
    border: "1px solid #166534",
    borderRadius: "8px",
  },

  loading: {
    padding: "60px",
    textAlign: "center",
    color: "#9caec8",
    fontSize: "18px",
  },

  error: {
    padding: "20px",
    background: "#451a1a",
    color: "#fca5a5",
    borderRadius: "8px",
    marginBottom: "15px",
  },

  empty: {
    padding: "50px",
    textAlign: "center",
    color: "#9caec8",
  },

};


// Risk badge colors

const riskStyles = {

  critical: {
    background: "#ef4444",
  },

  high: {
    background: "#f97316",
  },

  medium: {
    background: "#eab308",
    color: "#111827",
  },

  low: {
    background: "#22c55e",
  },

};


export default AIManagement;