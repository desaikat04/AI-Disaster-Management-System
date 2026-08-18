import { useState, useEffect } from "react";

function DisasterForm({ onSubmit, selectedDisaster }) {
    const [formData, setFormData] = useState({
        disaster_type: "",
        location: "",
        severity: "",
        latitude: "",
        longitude: "",
    });

    useEffect(() => {
        if (selectedDisaster) {
            setFormData(selectedDisaster);
        }
    }, [selectedDisaster]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);

        setFormData({
            disaster_type: "",
            location: "",
            severity: "",
            latitude: "",
            longitude: "",
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                display: "grid",
                gap: "15px",
                marginBottom: "30px",
            }}
        >
            <input
                name="disaster_type"
                placeholder="Disaster Type"
                value={formData.disaster_type}
                onChange={handleChange}
                required
            />

            <input
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleChange}
                required
            />

            <select
                name="severity"
                value={formData.severity}
                onChange={handleChange}
                required
            >
                <option value="">Select Severity</option>
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
            </select>

            <input
                type="number"
                step="0.000001"
                name="latitude"
                placeholder="Latitude"
                value={formData.latitude}
                onChange={handleChange}
                required
            />

            <input
                type="number"
                step="0.000001"
                name="longitude"
                placeholder="Longitude"
                value={formData.longitude}
                onChange={handleChange}
                required
            />

            <button type="submit">
                {selectedDisaster ? "Update Disaster" : "Add Disaster"}
            </button>
        </form>
    );
}

export default DisasterForm;