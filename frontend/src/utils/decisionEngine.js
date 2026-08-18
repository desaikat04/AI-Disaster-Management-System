// frontend/src/utils/decisionEngine.js

import {
  analyzeDisasterRisk,
} from "./riskEngine";


// =========================================
// GET DISASTER TYPE
// =========================================

const getDisasterType = (disaster) => {
  return String(
    disaster?.disaster_type ||
      disaster?.type ||
      ""
  ).toLowerCase();
};


// =========================================
// GET EMERGENCY PRIORITY
// =========================================

const getEmergencyPriority = (riskLevel) => {
  switch (riskLevel) {
    case "Critical":
      return {
        priority: "Immediate",
        priorityLevel: 1,
        message:
          "Immediate emergency response required.",
      };

    case "High":
      return {
        priority: "Urgent",
        priorityLevel: 2,
        message:
          "Rapid emergency response recommended.",
      };

    case "Medium":
      return {
        priority: "Moderate",
        priorityLevel: 3,
        message:
          "Situation should be monitored closely.",
      };

    default:
      return {
        priority: "Routine",
        priorityLevel: 4,
        message:
          "Normal monitoring and preparedness required.",
      };
  }
};


// =========================================
// GET RECOMMENDED ACTIONS
// =========================================

const getRecommendedActions = (
  disaster,
  riskLevel
) => {
  const type = getDisasterType(disaster);

  const actions = [];

  // -----------------------------------------
  // Actions based on risk
  // -----------------------------------------

  if (riskLevel === "Critical") {
    actions.push(
      "Activate emergency response procedures",
      "Alert disaster response teams",
      "Prepare nearby emergency shelters"
    );
  } else if (riskLevel === "High") {
    actions.push(
      "Deploy rapid response teams",
      "Monitor affected areas continuously"
    );
  } else if (riskLevel === "Medium") {
    actions.push(
      "Increase situation monitoring",
      "Verify emergency resources"
    );
  } else {
    actions.push(
      "Continue normal monitoring",
      "Maintain emergency preparedness"
    );
  }

  // -----------------------------------------
  // Actions based on disaster type
  // -----------------------------------------

  if (
    type.includes("flood")
  ) {
    actions.push(
      "Prepare evacuation support",
      "Check drinking water availability",
      "Monitor low-lying areas"
    );
  }

  if (
    type.includes("cyclone") ||
    type.includes("storm")
  ) {
    actions.push(
      "Monitor weather conditions",
      "Prepare evacuation routes",
      "Secure vulnerable infrastructure"
    );
  }

  if (
    type.includes("earthquake")
  ) {
    actions.push(
      "Prepare search and rescue teams",
      "Inspect critical infrastructure",
      "Prepare medical emergency units"
    );
  }

  if (
    type.includes("tsunami")
  ) {
    actions.push(
      "Issue coastal evacuation warning",
      "Move people to higher ground",
      "Prepare coastal emergency shelters"
    );
  }

  if (
    type.includes("landslide")
  ) {
    actions.push(
      "Restrict access to unstable areas",
      "Monitor surrounding slopes",
      "Prepare evacuation support"
    );
  }

  if (
    type.includes("fire") ||
    type.includes("wildfire")
  ) {
    actions.push(
      "Deploy fire response teams",
      "Prepare evacuation routes",
      "Monitor smoke-affected areas"
    );
  }

  // -----------------------------------------
  // Remove duplicate actions
  // -----------------------------------------

  return [...new Set(actions)];
};


// =========================================
// GET RESOURCE PRIORITIES
// =========================================

const getResourcePriorities = (
  disaster,
  riskLevel
) => {
  const type = getDisasterType(disaster);

  const resources = [];

  // -----------------------------------------
  // Critical / High risk
  // -----------------------------------------

  if (
    riskLevel === "Critical" ||
    riskLevel === "High"
  ) {
    resources.push(
      "Emergency medical kits",
      "Emergency transport",
      "Drinking water"
    );
  }

  // -----------------------------------------
  // Disaster-specific resources
  // -----------------------------------------

  if (type.includes("flood")) {
    resources.push(
      "Food supplies",
      "Drinking water",
      "Boats / rescue equipment",
      "Life jackets"
    );
  }

  if (
    type.includes("cyclone") ||
    type.includes("storm")
  ) {
    resources.push(
      "Emergency shelters",
      "Food supplies",
      "Drinking water",
      "Emergency communication equipment"
    );
  }

  if (type.includes("earthquake")) {
    resources.push(
      "Search and rescue equipment",
      "Medical teams",
      "Emergency shelters",
      "Heavy rescue equipment"
    );
  }

  if (type.includes("tsunami")) {
    resources.push(
      "Emergency shelters",
      "Evacuation transport",
      "Drinking water",
      "Medical teams"
    );
  }

  if (type.includes("landslide")) {
    resources.push(
      "Search and rescue equipment",
      "Medical teams",
      "Emergency transport",
      "Heavy equipment"
    );
  }

  if (
    type.includes("fire") ||
    type.includes("wildfire")
  ) {
    resources.push(
      "Fire response teams",
      "Water supply",
      "Respiratory protection equipment",
      "Emergency transport"
    );
  }

  // -----------------------------------------
  // Default resources
  // -----------------------------------------

  if (resources.length === 0) {
    resources.push(
      "Medical supplies",
      "Drinking water",
      "Food supplies"
    );
  }

  // Remove duplicates
  return [...new Set(resources)];
};


// =========================================
// RESPONSE TEAM RECOMMENDATION
// =========================================

const getResponseTeams = (
  disaster,
  riskLevel
) => {
  const type = getDisasterType(disaster);

  const teams = [];

  if (
    riskLevel === "Critical" ||
    riskLevel === "High"
  ) {
    teams.push(
      "Emergency Response Team",
      "Medical Response Team"
    );
  }

  if (
    type.includes("flood") ||
    type.includes("tsunami")
  ) {
    teams.push(
      "Water Rescue Team"
    );
  }

  if (
    type.includes("earthquake") ||
    type.includes("landslide")
  ) {
    teams.push(
      "Search & Rescue Team"
    );
  }

  if (
    type.includes("fire") ||
    type.includes("wildfire")
  ) {
    teams.push(
      "Fire Response Team"
    );
  }

  if (
    type.includes("cyclone") ||
    type.includes("storm")
  ) {
    teams.push(
      "Emergency Evacuation Team"
    );
  }

  if (teams.length === 0) {
    teams.push(
      "Local Emergency Monitoring Team"
    );
  }

  return [...new Set(teams)];
};


// =========================================
// MAIN AI DECISION ENGINE
// =========================================

export const analyzeDisasterDecision = (
  disaster
) => {

  // -----------------------------------------
  // Get existing risk analysis
  // -----------------------------------------

  const riskAnalysis =
    analyzeDisasterRisk(disaster);

  const {
    score,
    level,
  } = riskAnalysis;

  // -----------------------------------------
  // Determine emergency priority
  // -----------------------------------------

  const emergency =
    getEmergencyPriority(level);

  // -----------------------------------------
  // Determine recommended actions
  // -----------------------------------------

  const recommendedActions =
    getRecommendedActions(
      disaster,
      level
    );

  // -----------------------------------------
  // Determine resource priorities
  // -----------------------------------------

  const resourcePriorities =
    getResourcePriorities(
      disaster,
      level
    );

  // -----------------------------------------
  // Determine response teams
  // -----------------------------------------

  const responseTeams =
    getResponseTeams(
      disaster,
      level
    );

  // -----------------------------------------
  // Return complete decision
  // -----------------------------------------

  return {
    riskScore: score,

    riskLevel: level,

    riskMessage:
      riskAnalysis.message,

    priority:
      emergency.priority,

    priorityLevel:
      emergency.priorityLevel,

    priorityMessage:
      emergency.message,

    recommendedActions,

    resourcePriorities,

    responseTeams,
  };
};