import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { runAlertsEngine, getAlerts } from "../services/alerts.service";

const NotificationsBell = () => {
  const [open, setOpen] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alertsCount, setAlertsCount] = useState(0);
  const [hasNewAlerts, setHasNewAlerts] = useState(false);

  const prevCountRef = useRef(0);
  const containerRef = useRef(null);

  const loadAlerts = async () => {
    try {
      setLoading(true);

      await runAlertsEngine();
      const res = await getAlerts();

      const data = res.data || [];

      setAlerts(data);
      setAlertsCount(data.length);

      if (data.length > prevCountRef.current) {
        setHasNewAlerts(true);

        setTimeout(() => setHasNewAlerts(false), 4000);
      }

      prevCountRef.current = data.length;

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = async () => {
    const willOpen = !open;
    setOpen(willOpen);

    if (willOpen) {
      await loadAlerts();
      setHasNewAlerts(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">

      <button
        onClick={handleClick}
        className="relative flex items-center justify-center w-12 h-12 rounded-full text-white 
                   bg-gradient-to-r from-purple-600 to-violet-600 
                   shadow-lg shadow-purple-900/30 
                   transition-all duration-300 
                   hover:scale-105 hover:shadow-purple-700/40"
      >
        <Bell size={20} />

        {alertsCount > 0 && (
          <span className="absolute -top-1 -right-1 flex">

            {hasNewAlerts && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            )}

            <span className="relative inline-flex rounded-full bg-red-500 px-2 text-xs text-white font-bold shadow">
              {alertsCount}
            </span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border z-50">

          <div className="p-4 border-b font-semibold">
            Notificaciones
          </div>

          <div className="max-h-80 overflow-y-auto p-3 space-y-2">

            {loading ? (
              <p className="text-sm text-gray-500">Cargando...</p>
            ) : alerts.length === 0 ? (
              <p className="text-sm text-gray-500">Sin alertas</p>
            ) : (
              alerts.map((a) => (
                <div
                  key={a.alert_id}
                  className={`p-3 rounded-lg text-sm ${
                    a.severity === "high"
                      ? "bg-red-100 border border-red-300"
                      : "bg-yellow-100 border border-yellow-300"
                  }`}
                >
                  <p className="font-semibold">{a.message}</p>

                  <p className="text-xs text-gray-700 font-medium">
                    {a.tickets?.ticket_code}
                  </p>

                  <p className="text-xs text-gray-600">
                    {a.tickets?.ticket_title}
                  </p>
                </div>
              ))
            )}

          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsBell;