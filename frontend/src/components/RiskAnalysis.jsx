import React from "react";
import { analyzeDisasterRisk } from "../utils/riskEngine";

function RiskAnalysis({ disasters = [] }) {
  if (!disasters || disasters.length === 0) {
    return (
      <div style={styles.empty}>
        <h3>🤖 AI Risk Analysis</h3>
        <p>No disaster data available for analysis.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>🤖 AI Disaster Risk Analysis</h2>
          <p style={styles.subtitle}>
            Automated priority assessment of reported disasters
          </p>
        </div>
      </div>

      <div style={styles.list}>
        {disasters.map((disaster) => {
          const analysis = analyzeDisasterRisk(disaster);

          return (
            <div key={disaster.id} style={styles.card}>
              <div style={styles.cardTop}>
                <div>
                  <h3 style={styles.disasterTitle}>
                    {disaster.type || "Unknown Disaster"}
                  </h3>

                  <p style={styles.location}>
                    📍 {disaster.location || "Unknown location"}
                  </p>
                </div>

                <div
                  style={{
                    ...styles.badge,
                    background: analysis.color,
                  }}
                >
                  {analysis.icon} {analysis.level}
                </div>
              </div>

              <div style={styles.scoreSection}>
                <div style={styles.scoreLabel}>
                  <span>Risk Score</span>
                  <strong>{analysis.score}/100</strong>
                </div>

                <div style={styles.progressBackground}>
                  <div
                    style={{
                      ...styles.progress,
                      width: `${analysis.score}%`,
                      background: analysis.color,
                    }}
                  />
                </div>
              </div>

              <div style={styles.details}>
                <div>
                  <span style={styles.label}>Severity</span>
                  <span style={styles.value}>
                    {disaster.severity || "Unknown"}
                  </span>
                </div>

                <div>
                  <span style={styles.label}>AI Recommendation</span>
                  <span style={styles.value}>{analysis.message}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  container: {
    marginTop: "35px",
    padding: "25px",
    background: "#1f2937",
    borderRadius: "14px",
    border: "1px solid #334155",
  },

  header: {
    marginBottom: "25px",
  },

  title: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "24px",
  },

  subtitle: {
    marginTop: "7px",
    color: "#94a3b8",
    fontSize: "14px",
  },

  list: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "18px",
  },

  card: {
    background: "#111827",
    borderRadius: "12px",
    padding: "20px",
    border: "1px solid #374151",
  },

  cardTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "15px",
  },

  disasterTitle: {
    margin: 0,
    color: "#f8fafc",
    fontSize: "18px",
  },

  location: {
    marginTop: "8px",
    marginBottom: 0,
    color: "#94a3b8",
    fontSize: "14px",
  },

  badge: {
    padding: "7px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "13px",
    fontWeight: "bold",
    whiteSpace: "nowrap",
  },

  scoreSection: {
    marginTop: "22px",
  },

  scoreLabel: {
    display: "flex",
    justifyContent: "space-between",
    color: "#cbd5e1",
    fontSize: "14px",
    marginBottom: "8px",
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
    transition: "width 0.5s ease",
  },

  details: {
    marginTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },

  label: {
    display: "block",
    color: "#64748b",
    fontSize: "12px",
    marginBottom: "4px",
  },

  value: {
    color: "#e2e8f0",
    fontSize: "14px",
  },

  empty: {
    marginTop: "30px",
    padding: "30px",
    background: "#1f2937",
    borderRadius: "14px",
    color: "#cbd5e1",
    textAlign: "center",
  },
};

export default RiskAnalysis;