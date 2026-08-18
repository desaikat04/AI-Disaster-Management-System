import { Link, useNavigate } from "react-router-dom";

import {
  FaHome,
  FaExclamationTriangle,
  FaHospital,
  FaBoxes,
  FaMapMarkedAlt,
  FaChartBar,
  FaRobot,
  FaUserCircle,
  FaSignOutAlt,
} from "react-icons/fa";


function Sidebar() {

  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );


  // ================================
  // LOGOUT
  // ================================

  const handleLogout = () => {

    // Remove authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to login
    navigate("/login");
  };


  return (

    <div
      style={{
        width: "250px",
        height: "100vh",
        background: "#1f2937",
        color: "white",
        padding: "20px",
        boxSizing: "border-box",
        position: "fixed",
        left: 0,
        top: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >

      {/* =================================
          LOGO
      ================================= */}

      <h2
        style={{
          margin: "5px 0 25px",
          fontSize: "21px",
        }}
      >
        🚨 Disaster AI
      </h2>


      {/* =================================
          USER INFORMATION
      ================================= */}

      <div
        style={{
          background: "#111827",
          padding: "14px",
          borderRadius: "10px",
          marginBottom: "25px",
        }}
      >

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
          }}
        >

          <FaUserCircle
            style={{
              fontSize: "30px",
              color: "#60a5fa",
            }}
          />

          <div>

            <div
              style={{
                fontWeight: "bold",
                fontSize: "15px",
              }}
            >
              {user?.username || "User"}
            </div>

            <div
              style={{
                color: "#9ca3af",
                fontSize: "12px",
                marginTop: "3px",
                textTransform: "capitalize",
              }}
            >
              {user?.role || "User"}
            </div>

          </div>

        </div>

      </div>


      {/* =================================
          NAVIGATION
      ================================= */}

      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
        }}
      >

        {/* DASHBOARD */}

        <Link
          to="/"
          style={linkStyle}
        >
          <FaHome />
          <span>Dashboard</span>
        </Link>


        {/* DISASTERS */}

        <Link
          to="/disasters"
          style={linkStyle}
        >
          <FaExclamationTriangle />
          <span>Disasters</span>
        </Link>


        {/* SHELTERS */}

        <Link
          to="/shelters"
          style={linkStyle}
        >
          <FaHospital />
          <span>Shelters</span>
        </Link>


        {/* RESOURCES */}

        <Link
          to="/resources"
          style={linkStyle}
        >
          <FaBoxes />
          <span>Resources</span>
        </Link>


        {/* LIVE MAP */}

        <Link
          to="/map"
          style={linkStyle}
        >
          <FaMapMarkedAlt />
          <span>Live Map</span>
        </Link>


        {/* =================================
            AI MANAGEMENT
        ================================= */}

        <Link
          to="/ai-management"
          style={linkStyle}
        >
          <FaRobot />
          <span>AI Management</span>
        </Link>


        {/* ANALYTICS */}

        <Link
          to="/analytics"
          style={linkStyle}
        >
          <FaChartBar />
          <span>Analytics</span>
        </Link>

      </nav>


      {/* =================================
          LOGOUT
      ================================= */}

      <button
        onClick={handleLogout}
        style={logoutStyle}
      >
        <FaSignOutAlt />
        <span>Logout</span>
      </button>

    </div>
  );
}


// =====================================
// NAVIGATION STYLE
// =====================================

const linkStyle = {
  color: "white",
  textDecoration: "none",
  display: "flex",
  gap: "12px",
  alignItems: "center",
  padding: "11px 12px",
  borderRadius: "7px",
  transition: "background 0.2s",
};


// =====================================
// LOGOUT STYLE
// =====================================

const logoutStyle = {
  marginTop: "auto",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "10px",
  padding: "12px",
  border: "none",
  borderRadius: "7px",
  background: "#dc2626",
  color: "white",
  fontSize: "15px",
  fontWeight: "bold",
  cursor: "pointer",
};


export default Sidebar;