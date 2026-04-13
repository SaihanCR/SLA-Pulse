import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const ChartsSection = ({ charts }) => {
    if (!charts) {
        return <div>No hay datos de gráficos.</div>;
    }

    const ticketsByStatus = charts.ticketsByStatus || [];
    const ticketsTrend = charts.ticketsTrend || [];

    const order = ["Abierto", "En Progreso", "Pendiente", "Cerrado"];

    const STATUS_COLORS = {
        Abierto: "#7c3aed",
        "En Progreso": "#3b82f6",
        Pendiente: "#f59e0b",
        Cerrado: "#22c55e",
    };

    const legendData = order.map((status) => {
        const found = ticketsByStatus.find(
            (item) => item.status_name === status
        );

        return {
            name: status,
            value: found ? found.total_tickets : 0,
        };
    });

    const donutData = legendData.filter((item) => item.value > 0);

    const lineData = ticketsTrend.map((item) => ({
        date: item.date,
        total_tickets: item.total_tickets,
    }));

    const formatDate = (value) => {
        const date = new Date(value);
        return date.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "2-digit",
        });
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))",
                gap: "24px",
                marginBottom: "30px",
            }}
        >
            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "16px",
                    padding: "20px",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
            >
                <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
                    Tickets por estado
                </h3>

                <div style={{ width: "100%", height: 320 }}>
                    <ResponsiveContainer>
                        <PieChart>
                            <Pie
                                data={donutData}
                                dataKey="value"
                                nameKey="name"
                                cx="50%"
                                cy="50%"
                                innerRadius={70}
                                outerRadius={110}
                                paddingAngle={3}
                                label
                            >
                                {donutData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={STATUS_COLORS[entry.name]}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "18px",
                        flexWrap: "wrap",
                        marginTop: "12px",
                    }}
                >
                    {legendData.map((item, index) => (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "8px",
                                fontSize: "14px",
                                color: "#374151",
                            }}
                        >
                            <div
                                style={{
                                    width: "12px",
                                    height: "12px",
                                    borderRadius: "3px",
                                    backgroundColor: STATUS_COLORS[item.name],
                                }}
                            />
                            <span>
                                {item.name} ({item.value})
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div
                style={{
                    border: "1px solid #ddd",
                    borderRadius: "16px",
                    padding: "20px",
                    background: "#fff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                }}
            >
                <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
                    Tendencia de tickets
                </h3>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: 320,
                    }}
                >
                    <div style={{ width: "100%", height: "260px" }}>
                        <ResponsiveContainer>
                            <LineChart
                                data={lineData}
                                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#e5e7eb"
                                />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12, fill: "#6b7280" }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    labelFormatter={(label) => `Fecha: ${formatDate(label)}`}
                                    formatter={(value) => [`${value}`, "Tickets"]}
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "1px solid #e5e7eb",
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="total_tickets"
                                    stroke="#7c3aed"
                                    strokeWidth={3}
                                    dot={{ r: 5, strokeWidth: 2, fill: "#fff" }}
                                    activeDot={{ r: 7 }}
                                    name="Tickets"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div
                        style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: "8px",
                            marginTop: "4px",
                            fontSize: "14px",
                            color: "#7c3aed",
                            fontWeight: 500,
                        }}
                    >
                        <div
                            style={{
                                width: "18px",
                                height: "2px",
                                backgroundColor: "#7c3aed",
                                position: "relative",
                            }}
                        >
                            <div
                                style={{
                                    width: "8px",
                                    height: "8px",
                                    borderRadius: "50%",
                                    backgroundColor: "#fff",
                                    border: "2px solid #7c3aed",
                                    position: "absolute",
                                    top: "-4px",
                                    left: "5px",
                                }}
                            />
                        </div>
                        <span>Tickets</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartsSection;