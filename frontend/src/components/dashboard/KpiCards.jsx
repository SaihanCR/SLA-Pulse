const KpiCards = ({ kpis }) => {
    const summary = kpis?.[0];

    if (!summary) {
        return <div>No KPI data available.</div>;
    }

    const cards = [
        { title: "Users", value: summary.total_users, color: "#3b82f6" },
        { title: "Companies", value: summary.total_companies, color: "#7c3aed" },
        { title: "Departments", value: summary.total_departments, color: "#06b6d4" },
        { title: "Tickets", value: summary.total_tickets, color: "#f59e0b" },
        { title: "Alerts", value: summary.total_alerts, color: "#ef4444" },
        { title: "SLAs", value: summary.total_slas, color: "#22c55e" },
    ];

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                gap: "20px",
                marginBottom: "30px",
            }}
        >
            {cards.map((card, index) => (
                <div
                    key={index}
                    style={{
                        borderRadius: "16px",
                        padding: "20px",
                        background: "#fff",
                        boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                        borderLeft: `6px solid ${card.color}`,
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                        cursor: "default",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-4px)";
                        e.currentTarget.style.boxShadow = "0 10px 22px rgba(0,0,0,0.12)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.08)";
                    }}
                >
                    <h4
                        style={{
                            margin: 0,
                            fontSize: "14px",
                            color: "#666",
                            marginBottom: "10px",
                        }}
                    >
                        {card.title}
                    </h4>

                    <h2
                        style={{
                            margin: 0,
                            fontSize: "30px",
                            color: "#111",
                            fontWeight: "700",
                        }}
                    >
                        {card.value}
                    </h2>
                </div>
            ))}
        </div>
    );
};

export default KpiCards;