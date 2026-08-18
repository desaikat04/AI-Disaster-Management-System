import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";

import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { getDisasters } from "../services/disasterService";
import { getShelters } from "../services/shelterService";
import { getResources } from "../services/resourceService";

// =========================================
// CUSTOM MAP ICONS
// =========================================

const disasterIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      background:#dc2626;
      width:32px;
      height:32px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
      font-size:17px;
    ">
      🚨
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const shelterIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      background:#16a34a;
      width:32px;
      height:32px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
      font-size:17px;
    ">
      🏠
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

const resourceIcon = new L.DivIcon({
  className: "",
  html: `
    <div style="
      background:#2563eb;
      width:32px;
      height:32px;
      border-radius:50%;
      display:flex;
      align-items:center;
      justify-content:center;
      border:3px solid white;
      box-shadow:0 2px 8px rgba(0,0,0,0.5);
      font-size:17px;
    ">
      🚑
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -16],
});

// =========================================
// COMPONENT
// =========================================

function DisasterMap({
  activeLayer = "all",
}) {
  const [disasters, setDisasters] = useState([]);
  const [shelters, setShelters] = useState([]);
  const [resources, setResources] = useState([]);

  const [loading, setLoading] = useState(true);

  // Which markers should be visible.
  // "all" keeps the Dashboard showing all three categories.
  const showDisasters =
    activeLayer === "all" || activeLayer === "disasters";

  const showShelters =
    activeLayer === "all" || activeLayer === "shelters";

  const showResources =
    activeLayer === "all" || activeLayer === "resources";

  // =========================================
  // LOAD ALL MAP DATA
  // =========================================

  useEffect(() => {
    loadMapData();
  }, []);

  const loadMapData = async () => {
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
        "Failed to load map data:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // VALID COORDINATE CHECK
  // =========================================

  const isValidCoordinate = (
    latitude,
    longitude
  ) => {
    const lat = Number(latitude);
    const lng = Number(longitude);

    return (
      Number.isFinite(lat) &&
      Number.isFinite(lng) &&
      lat >= -90 &&
      lat <= 90 &&
      lng >= -180 &&
      lng <= 180
    );
  };

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
      }}
    >

      {/* =====================================
          MAP
      ===================================== */}

      <MapContainer
        center={[22.5726, 88.3639]}
        zoom={11}
        style={{
          height: "600px",
          width: "100%",
          borderRadius: "12px",
        }}
      >

        {/* OPENSTREETMAP */}

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* ===================================
            DISASTER MARKERS
        =================================== */}

        {showDisasters &&
          disasters.map((disaster) => {

          if (
            !isValidCoordinate(
              disaster.latitude,
              disaster.longitude
            )
          ) {
            return null;
          }

          return (
            <Marker
              key={`disaster-${disaster.id}`}
              position={[
                Number(disaster.latitude),
                Number(disaster.longitude),
              ]}
              icon={disasterIcon}
            >
              <Popup>

                <div
                  style={{
                    minWidth: "200px",
                  }}
                >

                  <h3
                    style={{
                      marginTop: 0,
                      color: "#dc2626",
                    }}
                  >
                    🚨 Disaster
                  </h3>

                  <p>
                    <strong>
                      Type:
                    </strong>{" "}
                    {disaster.disaster_type}
                  </p>

                  <p>
                    <strong>
                      Location:
                    </strong>{" "}
                    {disaster.location}
                  </p>

                  <p>
                    <strong>
                      Severity:
                    </strong>{" "}
                    {disaster.severity}
                  </p>

                  <p>
                    <strong>
                      Coordinates:
                    </strong>{" "}
                    {disaster.latitude},{" "}
                    {disaster.longitude}
                  </p>

                </div>

              </Popup>
            </Marker>
          );
        })}

        {/* ===================================
            SHELTER MARKERS
        =================================== */}

        {showShelters &&
          shelters.map((shelter) => {

          if (
            !isValidCoordinate(
              shelter.latitude,
              shelter.longitude
            )
          ) {
            return null;
          }

          return (
            <Marker
              key={`shelter-${shelter.id}`}
              position={[
                Number(shelter.latitude),
                Number(shelter.longitude),
              ]}
              icon={shelterIcon}
            >
              <Popup>

                <div
                  style={{
                    minWidth: "200px",
                  }}
                >

                  <h3
                    style={{
                      marginTop: 0,
                      color: "#16a34a",
                    }}
                  >
                    🏠 Shelter
                  </h3>

                  <p>
                    <strong>
                      Name:
                    </strong>{" "}
                    {shelter.name}
                  </p>

                  <p>
                    <strong>
                      Capacity:
                    </strong>{" "}
                    {shelter.capacity}
                  </p>

                  <p>
                    <strong>
                      Occupancy:
                    </strong>{" "}
                    {shelter.current_occupancy}
                  </p>

                  <p>
                    <strong>
                      Coordinates:
                    </strong>{" "}
                    {shelter.latitude},{" "}
                    {shelter.longitude}
                  </p>

                </div>

              </Popup>
            </Marker>
          );
        })}

        {/* ===================================
            RESOURCE MARKERS
        =================================== */}

        {showResources &&
          resources.map((resource) => {

          if (
            !isValidCoordinate(
              resource.latitude,
              resource.longitude
            )
          ) {
            return null;
          }

          return (
            <Marker
              key={`resource-${resource.id}`}
              position={[
                Number(resource.latitude),
                Number(resource.longitude),
              ]}
              icon={resourceIcon}
            >
              <Popup>

                <div
                  style={{
                    minWidth: "200px",
                  }}
                >

                  <h3
                    style={{
                      marginTop: 0,
                      color: "#2563eb",
                    }}
                  >
                    🚑 Resource
                  </h3>

                  <p>
                    <strong>
                      Type:
                    </strong>{" "}
                    {resource.resource_type}
                  </p>

                  <p>
                    <strong>
                      Name:
                    </strong>{" "}
                    {resource.name}
                  </p>

                  <p>
                    <strong>
                      Status:
                    </strong>{" "}
                    {resource.status}
                  </p>

                  <p>
                    <strong>
                      Coordinates:
                    </strong>{" "}
                    {resource.latitude},{" "}
                    {resource.longitude}
                  </p>

                </div>

              </Popup>
            </Marker>
          );
        })}

      </MapContainer>

      {/* =====================================
          MAP LEGEND
      ===================================== */}

      <div
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          zIndex: 1000,
          background: "#1f2937",
          color: "white",
          padding: "15px 18px",
          borderRadius: "10px",
          boxShadow:
            "0 4px 15px rgba(0,0,0,0.4)",
          fontSize: "14px",
        }}
      >

        <div
          style={{
            fontWeight: "bold",
            marginBottom: "10px",
          }}
        >
          Map Legend
        </div>

        {showDisasters && (
          <div
            style={{
              marginBottom: "7px",
            }}
          >
            🚨 Disaster
          </div>
        )}

        {showShelters && (
          <div
            style={{
              marginBottom: "7px",
            }}
          >
            🏠 Shelter
          </div>
        )}

        {showResources && (
          <div>
            🚑 Resource
          </div>
        )}

      </div>

      {/* =====================================
          LOADING
      ===================================== */}

      {loading && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            zIndex: 1000,
            background: "#1f2937",
            color: "white",
            padding: "10px 15px",
            borderRadius: "8px",
          }}
        >
          Loading map data...
        </div>
      )}

    </div>
  );
}

export default DisasterMap;