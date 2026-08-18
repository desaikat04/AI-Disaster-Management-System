function DisasterTable({
    disasters,
    onDelete,
    onEdit
}) {

    return (

        <table
            style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px"
            }}
        >

            <thead>

                <tr style={{ background: "#1f2937", color: "white" }}>

                    <th>ID</th>
                    <th>Type</th>
                    <th>Location</th>
                    <th>Severity</th>
                    <th>Action</th>

                </tr>

            </thead>

            <tbody>

                {disasters.map((d) => (

                    <tr key={d.id}>

                        <td>{d.id}</td>

                        <td>{d.disaster_type}</td>

                        <td>{d.location}</td>

                        <td>{d.severity}</td>

                        <td>

                            <button
                                onClick={() => onEdit(d)}
                            >
                                Edit
                            </button>

                            <button
                                onClick={() => onDelete(d.id)}
                                style={{ marginLeft: "10px" }}
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                ))}

            </tbody>

        </table>

    );

}

export default DisasterTable;