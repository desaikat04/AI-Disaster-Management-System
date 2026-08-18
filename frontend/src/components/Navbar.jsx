function Navbar() {
  return (
    <div
      style={{
        height: "70px",
        background: "#171735",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}
    >
      <h2>AI Disaster Response Management System</h2>

      <div>👤 Admin</div>
    </div>
  );
}

export default Navbar;