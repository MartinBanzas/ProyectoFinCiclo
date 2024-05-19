import { useCallback, useEffect, useState } from "react";
import LogList from "../../../models/LogList";
import { userId } from "../Login/TokenHandler";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";

export const StandardView = () => {
  const [logs, setLogs] = useState<LogList[]>([]);
  const [btnIniciar, setBtnIniciar]=useState(false)
  const [btnCerrar, setBtnCerrar]=useState(true)  
  const [modalConfirm, setModalConfirm]=useState(false)

  const user_id = userId;
  const get_user_logs = useCallback(async () => {
    const baseUrl = `http://localhost:5000/get_logs_by_user/${user_id}`;
    const url = `${baseUrl}`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        setModalConfirm(true)
      }

      const logLists = await response.json();

      console.log(logLists);

      setLogs(logLists);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, []);

  useEffect(() => {
    get_user_logs();
  }, [get_user_logs]);

  const iniciar_sesion_request = async () => {
    const user_id = userId;
    const baseUrl = `http://localhost:5000/inicio_sesion/${user_id}`;
    const url = `${baseUrl}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST', 
      });
  
      if (!response.ok) {
       
        throw new Error("Ya iniciaste sesión");
      
        
      }
  
      const logLists = await response.json();
  
      console.log(logLists);
  
      setLogs(logLists);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };


  const cerrar_sesion_request = async () => {
    const user_id = userId;
    const baseUrl = `http://localhost:5000/fin_sesion/${user_id}`;
    const url = `${baseUrl}`;
  
    try {
      const response = await fetch(url, {
        method: 'POST', 
      });
  
      if (!response.ok) {
        throw new Error("Algo ha ido mal");
      }
  
      const logLists = await response.json();
  
      console.log(logLists);
  
      setLogs(logLists);
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleIniciar = () => {

    iniciar_sesion_request()
    setBtnIniciar(true)
    setBtnCerrar(false)
  }

  const handleCerrar = () => {
    cerrar_sesion_request()
    setBtnCerrar(true)
    setBtnIniciar(false)
  }

  const initial_button_state = () => {
    
  }

  return (
    <div>
      <div className="container-md rounded mt-6">
        <button className="btn btn-primary" onClick={handleIniciar} disabled={btnIniciar}>Iniciar sesión</button>
        <button className="btn btn-secondary ms-2" onClick={handleCerrar} disabled={btnCerrar}>Cerrar sesión</button>
        <h3>Hora</h3>
      </div>
      <div className="w-25 container-md bg-white">
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          editable={false}
          selectable={false}
          height={300} 
          events={logs.map((log) => ({
            color: log.sesion_ok ? "green" : "red", 
            title: log.sesion_ok ? "OK" : "Not OK",
            start: log.day,
            end: log.day, 
            description: `Inicio: ${log.inicio_sesion}, Fin: ${log.fin_sesion}`,
          }))}
        />
      </div>
    </div>
  );
};