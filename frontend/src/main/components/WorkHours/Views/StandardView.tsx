import { useCallback, useEffect, useState } from "react";
import LogList from "../../../../models/LogList";
import { userId } from "../../Login/TokenHandler";
import FullCalendar from "@fullcalendar/react";
import esLocale from "@fullcalendar/core/locales/es";
import dayGridPlugin from "@fullcalendar/daygrid";
import { ConfirmModal } from "../Modals/ConfirmModal";

export const StandardView = () => {
  const [logs, setLogs] = useState<LogList[]>([]);
  const [desactivarBtnIniciar, setDesactivarBtnIniciar] = useState(false);
  const [desactivarBtnCerrar, setDesactivarBtnCerrar] = useState(true);
  const [modalCerrarSesion, setCerrarSesionModal] = useState(false);
  const [horaInicial, setHoraInicial] = useState("");
  const [confirmModal, setConfirmModal] = useState(false)
  const [tiempoTranscurrido, setTiempoTranscurrido] = useState("00:00:00");

  const user_id = userId;

  const get_user_logs = useCallback(async () => {
    const baseUrl = `http://localhost:5000/get_logs_by_user/${user_id}`;
    const loged_today = `http://localhost:5000/get_logs_today/${user_id}`;

    try {
      const response = await fetch(baseUrl);
      const response_loged_today = await fetch(loged_today);

      if (!response.ok) {
        setCerrarSesionModal(true);
      }

      if (!response_loged_today.ok) {
        setDesactivarBtnIniciar(false);
        setDesactivarBtnCerrar(true);
      }

      if (response_loged_today.ok) {
        const hora = await response_loged_today.json();
        console.log(hora);
        if (hora.logeado) {
          setHoraInicial(hora.logeado);
          console.log(hora.logeado);
          setDesactivarBtnIniciar(true);
          setDesactivarBtnCerrar(false);
        } else if (hora.closed) {
          setDesactivarBtnCerrar(true);
          setDesactivarBtnIniciar(true);
          setHoraInicial("");
        }
      }

      const logLists = await response.json();

      console.log(logLists);
      if (Array.isArray(logLists)) {
        setLogs(logLists);
      } else {
        console.error("Expected an array but got:", logLists);
        setLogs([]);
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  }, [user_id]);

  useEffect(() => {
    get_user_logs();
  }, [get_user_logs]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (horaInicial) {
      interval = setInterval(() => {
        const ahora = new Date();
        const [horas, minutos, segundos] = horaInicial.split(":").map(Number);
        const horaInicialDate = new Date(
          ahora.getFullYear(),
          ahora.getMonth(),
          ahora.getDate(),
          horas,
          minutos,
          segundos
        );

        const diferencia = ahora.getTime() - horaInicialDate.getTime();
        const horasTranscurridas = Math.floor(diferencia / (1000 * 60 * 60));
        const minutosTranscurridos = Math.floor(
          (diferencia % (1000 * 60 * 60)) / (1000 * 60)
        );
        const segundosTranscurridos = Math.floor(
          (diferencia % (1000 * 60)) / 1000
        );

        setTiempoTranscurrido(
          `${String(horasTranscurridas).padStart(2, "0")}:${String(
            minutosTranscurridos
          ).padStart(2, "0")}:${String(segundosTranscurridos).padStart(2, "0")}`
        );
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [horaInicial]);

  const iniciar_sesion_request = async () => {
    const user_id = userId;
    const baseUrl = `http://localhost:5000/inicio_sesion/${user_id}`;
    const url = `${baseUrl}`;

    try {
      const response = await fetch(url, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Ya iniciaste sesión");
      }

      const hora = await response.json();
      setHoraInicial(hora.logeado);
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
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("Algo ha ido mal");
      }
    } catch (error) {
      console.error("Error fetching logs:", error);
    }
  };

  const handleIniciar = () => {
    iniciar_sesion_request();
    setDesactivarBtnIniciar(true);
    setDesactivarBtnCerrar(false);
  };

  const handleCerrar = () => {
    cerrar_sesion_request();
    setDesactivarBtnCerrar(true);
    setDesactivarBtnIniciar(false);
    setConfirmModal(false);
    setHoraInicial("");
  };

  return (
    <div>
      <div className="container-md rounded mt-6">
        <button
          className="btn btn-primary"
          onClick={handleIniciar}
          disabled={desactivarBtnIniciar}
        >
          Iniciar sesión
        </button>
        <button
          className="btn btn-secondary ms-2"
          onClick={()=>setConfirmModal(true)}
          disabled={desactivarBtnCerrar}
        >
          Cerrar sesión
        </button>
        <h3>{tiempoTranscurrido}</h3>
      </div>
      <div className="w-50 container-md bg-white">
        <h3>Control horario</h3>
        <FullCalendar
          plugins={[dayGridPlugin]}
          initialView="dayGridMonth"
          locale={esLocale}
          editable={false}
          selectable={false}
          height={400}
          events={
            Array.isArray(logs)
              ? logs.map((log) => ({
                  color: log.sesion_ok ? "green" : "red",
                  title: log.sesion_ok ? "OK" : "Conflicto",
                  start: log.day,
                  end: log.day,
                  description: `Inicio: ${log.inicio_sesion}, Fin: ${log.fin_sesion}`,
                }))
              : []
          }
        />
      </div>
      <ConfirmModal confirmModal={confirmModal} tiempoTranscurrido={tiempoTranscurrido} handleCerrar={handleCerrar} setConfirmModal={setConfirmModal} />
    </div>
  );
};
