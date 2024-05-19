import React, { useEffect, useCallback, useState } from "react";
import LogList from "../../../models/LogList";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";

export const AdminView = () => {
  const [logs, setLogs] = useState<LogList[]>([]);

  const get_all_logs = useCallback(async () => {
    const baseUrl = "http://localhost:5000/get_all_logs/";
    const url = `${baseUrl}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Algo ha ido mal");
      }

      const logLists = await response.json();

      console.log(logLists);
      setLogs(logLists);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, []);

  useEffect(() => {
    get_all_logs();
  }, []);
  
  return (
    <div className="container-md text-center bg-white mt-6 rounded w-25">
      {logs.map((user, index) => (
        <div key={index}>
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            locale={esLocale}
            editable={false}
            selectable={false}
            height={400}
          />
        </div>
      ))}
    </div>
  );
};