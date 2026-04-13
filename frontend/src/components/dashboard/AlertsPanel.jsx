const AlertsPanel = ({ alerts }) => {
  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "12px",
        padding: "20px",
        background: "#fff",
      }}
    >
      <h3>Alertas</h3>

      {!alerts || alerts.length === 0 ? (
        <p>No hay alertas disponibles.</p>
      ) : (
        <ul>
          {alerts.map((alert, index) => (
            <li key={index}>{JSON.stringify(alert)}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AlertsPanel;