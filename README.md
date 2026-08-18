# 🚨 AI Disaster Management System

An AI-assisted disaster management and emergency response platform designed to help administrators monitor disasters, manage emergency shelters and resources, visualize emergency locations on live maps, assess disaster risk, and generate intelligent resource allocation recommendations.

The system combines a **React frontend**, **FastAPI backend**, and **PostgreSQL database** to provide a centralized platform for disaster response management.

---

## 🌟 Features

### 🚨 Disaster Management

- Create and register disaster incidents
- View, edit, and delete disaster records
- Search disasters by type or location
- Filter disasters by severity
- Store disaster latitude and longitude
- Visualize disaster locations on an interactive map
- View disaster severity and AI risk information

### 🏠 Shelter Management

- Register emergency shelters
- Manage shelter capacity
- Track available shelter capacity
- Store shelter latitude and longitude
- Edit and delete shelter information
- Search and manage shelters
- Visualize shelter locations on the live map

### 🚑 Emergency Resource Management

- Register emergency resources
- Manage resource type and quantity
- Track resource availability and status
- Store resource latitude and longitude
- Edit and delete resources
- Search resources by type, name, or status
- Visualize resources on the live map

### 🔐 Authentication

- User registration
- User login
- Email validation
- Password validation
- Authentication token handling
- Protected application routes
- Logout functionality

### 📊 Dashboard

The dashboard provides a centralized overview of the disaster response system, including:

- Total disasters
- Total shelters
- Total resources
- Disaster information
- AI risk information
- Recent disaster information
- Live map with disasters, shelters, and resources

---

## 📸 Screenshots

### 📊 Dashboard

![Dashboard](screenshots/dashboard.png)

### 🚨 Disaster Management

![Disaster Management](screenshots/disasters.png)

### 🏠 Shelter Management

![Shelter Management](screenshots/shelters.png)

### 🚑 Resource Management

![Resource Management](screenshots/resources.png)

### 🤖 AI Management

![AI Management](screenshots/ai-management.png)

### 🗺️ Live Map

![Live Map](screenshots/live-map.png)

---

## 🧠 AI Disaster Risk Analysis

The system includes an AI-assisted disaster risk analysis engine that evaluates disaster information and produces a risk assessment.

The risk analysis provides:

- Risk score
- Risk level
- Priority level
- Recommended actions
- Response team recommendations
- Resource priorities

### Example

```text
Disaster: Flood
Location: Kolkata

Risk Score: 85/100
Priority: Critical

Recommended Action:
Immediate emergency response required.
```

The risk engine helps administrators identify high-priority incidents and determine which disasters require faster attention.

---

## 🤖 AI Resource Allocation

The AI Management module provides intelligent recommendations for allocating emergency resources to disasters.

The allocation process considers factors such as:

- Disaster risk level
- Disaster priority
- Resource availability
- Resource quantity
- Resource status
- Distance between disaster and resource
- Shelter availability
- Shelter capacity

### Example

```text
🚨 Disaster: Flood
Priority: Critical

🚑 Ambulance
Available: 3
Distance: 2.4 km
Recommended Deployment: 2
Reserve: 1

💧 Water Tanker
Available: 50
Distance: 1.8 km
Recommended Deployment: 30
Reserve: 20

🏠 Recommended Shelter
Community Shelter
Distance: 3.2 km
Available Capacity: 120
```

The system currently operates as a **decision-support system**. AI recommendations do not automatically dispatch resources or modify inventory.

---

## 🗺️ Live Map

The application provides an interactive map for visualizing disaster-response locations.

The map supports three categories:

- 🚨 Disasters
- 🏠 Shelters
- 🚑 Resources

### Dashboard Map

The Dashboard displays all three categories together:

```text
🚨 Disasters + 🏠 Shelters + 🚑 Resources
```

### Management Page Maps

Each management page has its own default map category while allowing the user to switch between all three categories.

#### Disaster Management

Default:

```text
🚨 Disasters
```

Users can switch to:

```text
🏠 Shelters
🚑 Resources
```

#### Shelter Management

Default:

```text
🏠 Shelters
```

Users can switch to:

```text
🚨 Disasters
🚑 Resources
```

#### Resource Management

Default:

```text
🚑 Resources
```

Users can switch to:

```text
🚨 Disasters
🏠 Shelters
```

### Distance Calculation

The system uses stored latitude and longitude coordinates to calculate geographical distance between disasters, resources, and shelters.

This distance information is used by the AI Management module when generating resource and shelter recommendations.

---

## 🛠️ Tech Stack

### Frontend

- React
- JavaScript
- Vite
- HTML
- CSS
- React Router
- React Leaflet

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- REST APIs

### Database

- PostgreSQL

### Development Tools

- Visual Studio Code
- Git
- GitHub
- npm
- Python Virtual Environment

---

## 📁 Project Structure

```text
AI-Disaster-Management-System/
│
├── backend/
│   ├── app/
│   │   ├── database/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── schemas/
│   │   └── utils/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── LICENSE
└── README.md
```

---

# ⚙️ Setup & Installation

## Prerequisites

Make sure the following are installed:

- Python 3.x
- Node.js and npm
- PostgreSQL
- Git
- Visual Studio Code or another code editor

## 1. Clone the Repository

```bash
git clone https://github.com/desaikat04/AI-Disaster-Management-System.git
```

Navigate into the project:

```bash
cd AI-Disaster-Management-System
```

---

# 🐍 Backend Setup

Navigate to the backend:

```bash
cd backend
```

Create a Python virtual environment:

```powershell
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

If PowerShell blocks script execution:

```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

Then activate the environment again:

```powershell
.\venv\Scripts\Activate.ps1
```

## Install Backend Dependencies

```bash
pip install -r requirements.txt
```

---

# 🗄️ Database Setup

This project uses **PostgreSQL**.

## 1. Start PostgreSQL

Make sure the PostgreSQL service is running.

## 2. Create the Database

Create a database named:

```text
disaster_db
```

Using SQL:

```sql
CREATE DATABASE disaster_db;
```

## 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/disaster_db
```

Replace `YOUR_PASSWORD` with your local PostgreSQL password.

> ⚠️ Never commit your `.env` file to GitHub.

A `.env.example` file can be used to document the required environment variables without exposing credentials.

---

# 🚀 Running the Application

Run the backend and frontend in separate terminals.

## Start the Backend

From the `backend` directory:

```bash
uvicorn app.main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

FastAPI Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

## Start the Frontend

Open another terminal:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

## Application Startup Order

```text
1. Start PostgreSQL
        ↓
2. Start FastAPI backend
        ↓
3. Start React frontend
        ↓
4. Open http://localhost:5173
```

---

# 🔌 API Overview

The FastAPI backend provides REST APIs for the major application modules.

## 🔐 Authentication

```text
POST   /auth/register
POST   /auth/login
```

## 🚨 Disaster APIs

```text
GET      /disasters
POST     /disasters
GET      /disasters/{id}
PUT      /disasters/{id}
DELETE   /disasters/{id}
```

## 🏠 Shelter APIs

```text
GET      /shelters
POST     /shelters
GET      /shelters/{id}
PUT      /shelters/{id}
DELETE   /shelters/{id}
```

## 🚑 Resource APIs

```text
GET      /resources
POST     /resources
GET      /resources/{id}
PUT      /resources/{id}
DELETE   /resources/{id}
```

> Endpoint paths may vary depending on the backend router configuration. The FastAPI Swagger documentation at `/docs` is the authoritative reference for the currently running API.

---

# 🏗️ System Architecture

```text
                    ┌──────────────────────────┐
                    │      React Frontend      │
                    │                          │
                    │ Dashboard                │
                    │ Disaster Management      │
                    │ Shelter Management        │
                    │ Resource Management      │
                    │ AI Management             │
                    │ Live Maps                 │
                    └────────────┬─────────────┘
                                 │
                                 │ REST API
                                 ▼
                    ┌──────────────────────────┐
                    │      FastAPI Backend     │
                    │                          │
                    │ Authentication            │
                    │ Disaster APIs             │
                    │ Shelter APIs              │
                    │ Resource APIs             │
                    └────────────┬─────────────┘
                                 │
                                 │ SQLAlchemy
                                 ▼
                    ┌──────────────────────────┐
                    │       PostgreSQL         │
                    │                          │
                    │ Users                     │
                    │ Disasters                 │
                    │ Shelters                  │
                    │ Resources                 │
                    └──────────────────────────┘

                    ┌──────────────────────────┐
                    │     AI Decision Engine   │
                    │                          │
                    │ Risk Analysis             │
                    │ Distance Analysis         │
                    │ Resource Allocation       │
                    │ Shelter Recommendation    │
                    └──────────────────────────┘
```

---

# 🧠 AI Decision Flow

```text
              Disaster Report
                     │
                     ▼
            ┌─────────────────┐
            │ Risk Assessment  │
            └────────┬────────┘
                     │
                     ▼
               Risk / Priority
                     │
                     ▼
          ┌───────────────────────┐
          │ Find Available        │
          │ Resources             │
          └───────────┬───────────┘
                      │
                      ▼
              Calculate Distance
                      │
                      ▼
          ┌───────────────────────┐
          │ Prioritize Resources  │
          │ Based on Risk,        │
          │ Distance & Quantity   │
          └───────────┬───────────┘
                      │
                      ▼
            Recommend Deployment
                      │
                      ▼
          ┌───────────────────────┐
          │ Find Suitable Shelter │
          │ & Available Capacity  │
          └───────────┬───────────┘
                      │
                      ▼
              AI Response Plan
```

---

# ⚠️ Limitations

The current implementation has the following limitations:

- AI recommendations are currently decision-support recommendations.
- Resources are not automatically dispatched.
- Resource quantities are not automatically deducted after an AI recommendation.
- Real-time external disaster data feeds are not currently integrated.
- Advanced predictive machine-learning models are not currently implemented.
- The system currently depends on manually entered disaster, shelter, and resource information.
- Real-time GPS tracking of emergency vehicles is not currently implemented.

---

# 🔮 Future Improvements

Possible future improvements include:

- Integration with real-time disaster APIs
- Weather and environmental data integration
- Automatic disaster alerts
- SMS and email notifications
- Real-time resource tracking
- GPS-based emergency vehicle tracking
- Advanced AI/ML-based disaster prediction
- Population impact estimation
- Automatic resource inventory updates
- Emergency response team assignment
- Route optimization
- Mobile application
- Role-based access control
- Real-time WebSocket updates
- Historical disaster analytics
- Predictive disaster analytics
- Automated emergency response workflows

---

# 🔒 Security

Sensitive information should never be committed to the repository.

The following should remain local:

```text
.env
venv/
env/
.venv/
node_modules/
__pycache__/
```

Environment variables should be configured locally.

Example:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/disaster_db
```

The actual database password must never be placed in the repository.

---

# 📌 Main Application Modules

| Module | Purpose |
|---|---|
| Authentication | User registration and login |
| Dashboard | Overall disaster response overview |
| Disaster Management | Manage disaster incidents |
| Shelter Management | Manage emergency shelters |
| Resource Management | Manage emergency resources |
| Live Map | Visualize disaster-response locations |
| AI Risk Analysis | Analyze disaster risk |
| AI Management | Recommend resource allocation |
| Analytics | Display disaster-related information |

---

# 🎯 Project Objective

The primary objective of the AI Disaster Management System is to provide a centralized digital platform for disaster response management.

The system aims to help emergency administrators:

- Monitor disaster incidents
- Identify high-risk situations
- Locate nearby emergency resources
- Manage emergency shelters
- Understand resource availability
- Calculate distances between response locations
- Make faster resource allocation decisions
- Visualize emergency locations
- Improve disaster response coordination

---

# 📚 Development

This project was developed as a full-stack academic project with a focus on:

- Full-stack web development
- REST API development
- Database management
- Interactive geospatial visualization
- AI-assisted decision support
- Emergency resource management

---

# 👨‍💻 Author

**Saikat De**

B.Tech — Computer Science & Engineering

---

# 📄 License

This project is licensed under the **MIT License**.

See the [LICENSE](LICENSE) file for details.

---

## ⭐ Project Status

**Active Development**

The core disaster, shelter, resource management, live mapping, AI risk analysis, and AI-assisted resource allocation features are implemented. Additional real-time data integration and advanced AI capabilities can be added in future versions.
