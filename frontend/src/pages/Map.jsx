import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { getDisasters } from "../services/disasterService";
import { getShelters } from "../services/shelterService";

function Map() {

    // -----------------------------
    // States
    // -----------------------------
    const [disasters, setDisasters] = useState([]);
    const [shelters, setShelters] = useState([]);

    // -----------------------------
    // Load data when page opens
    // -----------------------------
    useEffect(() => {
        loadDisasters();
        loadShelters();
    }, []);

    // -----------------------------
    // Fetch disasters
    // -----------------------------
    const loadDisasters = async () => {
        try {
            const data = await getDisasters();
            setDisasters(data);
        } catch (error) {
            console.error(error);
        }
    };

    // -----------------------------
    // Fetch shelters
    // -----------------------------
    const loadShelters = async () => {
        try {
            const data = await getShelters();
            setShelters(data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <MapContainer
            center={[22.5726, 88.3639]}
            zoom={11}
            style={{
                height: "600px",
                width: "100%"
            }}
        >

            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* -----------------------------
                Disaster Markers
            ------------------------------ */}

            {disasters.map((disaster) => (
                <Marker
                    key={disaster.id}
                    position={[
                        disaster.latitude,
                        disaster.longitude
                    ]}
                >
                    <Popup>
                        <h3>{disaster.disaster_type}</h3>

                        <p>
                            Location:
                            {" "}
                            {disaster.location}
                        </p>

                        <p>
                            Severity:
                            {" "}
                            {disaster.severity}
                        </p>
                    </Popup>
                </Marker>
            ))}

            {/* -----------------------------
                Shelter Markers
            ------------------------------ */}

            {shelters.map((shelter) => (
                <Marker
                    key={shelter.id}
                    position={[
                        shelter.latitude,
                        shelter.longitude
                    ]}
                >
                    <Popup>

                        <h3>{shelter.name}</h3>

                        <p>
                            Capacity:
                            {" "}
                            {shelter.capacity}
                        </p>

                        <p>
                            Occupancy:
                            {" "}
                            {shelter.current_occupancy}
                        </p>

                    </Popup>
                </Marker>
            ))}

        </MapContainer>
    );
}

export default Map;