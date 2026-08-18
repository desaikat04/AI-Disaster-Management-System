import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Disasters from "./pages/Disasters";
import Shelters from "./pages/Shelters";
import Resources from "./pages/Resources";
import Map from "./pages/Map";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AIManagement from "./pages/AIManagement";

import ProtectedRoute from "./components/ProtectedRoute";


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =========================
            PUBLIC ROUTE
        ========================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route path="/register" element={<Register />} />

        {/* =========================
            PROTECTED APPLICATION
        ========================= */}

        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>

                <Routes>

                  <Route
                    path="/"
                    element={<Dashboard />}
                  />

                  <Route
                    path="/disasters"
                    element={<Disasters />}
                  />

                  <Route
                    path="/shelters"
                    element={<Shelters />}
                  />

                  <Route
                    path="/resources"
                    element={<Resources />}
                  />

                  <Route
                    path="/map"
                    element={<Map />}
                  />

                  <Route
                    path="/analytics"
                    element={<Analytics />}
                  />
                  <Route
  path="/ai-management"
  element={
    <ProtectedRoute>
      <AIManagement />
    </ProtectedRoute>
  }
/>

                </Routes>

              </Layout>
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;