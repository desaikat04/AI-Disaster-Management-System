// frontend/src/utils/riskEngine.js


// Calculate risk score
export const calculateRiskScore = (disaster) => {
    let score = 0;

    // -----------------------------
    // Severity
    // -----------------------------

    const severity = String(
        disaster?.severity || ""
    ).toLowerCase();

    if (severity === "high") {
        score += 60;
    } else if (severity === "medium") {
        score += 35;
    } else if (severity === "low") {
        score += 15;
    }


    // -----------------------------
    // Disaster Type
    // -----------------------------

    // Your backend may use disaster_type
    // instead of type

    const type = String(
        disaster?.disaster_type ||
        disaster?.type ||
        ""
    ).toLowerCase();


    if (
        type.includes("earthquake") ||
        type.includes("tsunami")
    ) {
        score += 25;
    } else if (
        type.includes("flood") ||
        type.includes("cyclone")
    ) {
        score += 20;
    } else if (
        type.includes("landslide") ||
        type.includes("fire")
    ) {
        score += 15;
    } else {
        score += 10;
    }


    // Maximum score = 100
    return Math.min(score, 100);
};


// -----------------------------
// Get Risk Level
// -----------------------------

export const getRiskLevel = (score) => {

    if (score >= 70) {
        return {
            level: "Critical",
            color: "#ef4444",
            icon: "🔴",
            message: "Immediate response required",
        };
    }

    if (score >= 40) {
        return {
            level: "High",
            color: "#f97316",
            icon: "🟠",
            message: "Rapid response recommended",
        };
    }

    if (score >= 20) {
        return {
            level: "Medium",
            color: "#eab308",
            icon: "🟡",
            message: "Situation should be monitored",
        };
    }

    return {
        level: "Low",
        color: "#22c55e",
        icon: "🟢",
        message: "Normal monitoring required",
    };
};


// -----------------------------
// Complete Disaster Analysis
// -----------------------------

export const analyzeDisasterRisk = (disaster) => {

    const score = calculateRiskScore(disaster);

    const risk = getRiskLevel(score);

    return {
        score,
        ...risk,
    };
};