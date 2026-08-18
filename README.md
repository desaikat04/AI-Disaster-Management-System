# 🚨 AI Disaster Management System

An AI-assisted disaster management and emergency response platform designed to help administrators monitor disasters, manage emergency shelters and resources, visualize locations on live maps, assess disaster risk, and generate intelligent resource allocation recommendations.

The system combines a modern React frontend with a FastAPI backend and PostgreSQL database to provide a centralized platform for disaster response management.

---

## 🌟 Features

### 🚨 Disaster Management
- Create and register disaster incidents
- View reported disasters
- Edit and delete disaster records
- Search disasters by type or location
- Filter disasters by severity
- Track disaster locations using an interactive map
- View disaster severity and risk information

### 🏠 Shelter Management
- Register emergency shelters
- Manage shelter capacity
- Track available shelter capacity
- Store shelter location using latitude and longitude
- Edit and delete shelter information
- Search and manage shelters
- Visualize shelters on the live map

### 🚑 Emergency Resource Management
- Register emergency resources
- Manage resource type and quantity
- Track resource availability
- Track resources currently in use
- Store resource locations
- Edit and delete resources
- Search resources by type, name, or status
- Visualize resources on the live map

### 🗺️ Live Disaster Map
The system provides an interactive map for visualizing emergency locations.

The map supports three categories:

- 🚨 Disasters
- 🏠 Shelters
- 🚑 Resources

#### Map behavior

**Dashboard**
- Displays disasters, shelters, and resources together.

**Disaster Management**
- Displays disaster locations by default.
- Users can switch between disasters, shelters, and resources.

**Shelter Management**
- Displays shelter locations by default.
- Users can switch between disasters, shelters, and resources.

**Resource Management**
- Displays resource locations by default.
- Users can switch between disasters, shelters, and resources.

---

## 🧠 AI Disaster Risk Analysis

The system includes an AI-assisted disaster risk analysis engine that evaluates reported disaster information and produces a risk assessment.

The risk analysis provides:

- Risk score
- Risk level
- Priority level
- Recommended actions
- Response team recommendations
- Resource priorities

Example:

```text
Disaster: Flood
Location: Kolkata

Risk Score: 85/100
Priority: Critical

Recommended Action:
Immediate emergency response required.