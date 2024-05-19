import React, { useEffect, useCallback, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";

const styles = `
.calendars-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.user-calendar {
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
  background-color: #f9f9f9;
  width: 500px; // Custom width for the calendar container
}

.user-calendar h3 {
  margin-bottom: 10px;
  font-size: 16px;
  text-align: center;
}
`;

const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

// Define the type for the log entries
interface LogEntry {
  id: number;
  user_id: number;
  day: string; // Assuming this is a string in the format "YYYY-MM-DD"
  inicio_sesion: string;
  fin_sesion: string | null; // fin_sesion can be null
  sesion_ok: boolean;

}

// Define the type for the logs state
interface LogsState {
  [userName: string]: LogEntry[];
}

export const AdminView = () => {
  const [logs, setLogs] = useState<LogsState>({});

  const get_all_logs = useCallback(async () => {
    const baseUrl = "http://localhost:5000/get_all_logs/";
    const url = `${baseUrl}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Algo ha ido mal");
      }

      const logLists: LogsState = await response.json();

      console.log(logLists);
    
      setLogs(logLists);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, []);

  useEffect(() => {
    get_all_logs();
  }, [get_all_logs]);

  return (
    <div className="container-md text-center mt-6 rounded w-75">
       <h3>Control horario de empleados</h3>
      <div className="calendars-container">
        {Object.entries(logs).map(([userName, userLogs], index) => (
          <div key={index} className="user-calendar">
            <h3>{userName}</h3>
            <FullCalendar
              plugins={[dayGridPlugin]}
              initialView="dayGridMonth"
              locale={esLocale}
              editable={false}
              selectable={false}
              height={300} // Adjust height as needed
               
              events={userLogs.map(log => ({
                color: log.sesion_ok ? "green" : "red", // Correctly set the color property
                title: log.sesion_ok ? "OK" : "Not OK",
                start: log.day,
                end: log.day, // assuming each log represents a full day event
                description: `Inicio: ${log.inicio_sesion}, Fin: ${log.fin_sesion}`
              }))}
            />
          </div>
        ))}
      </div>
    </div>
  );
};