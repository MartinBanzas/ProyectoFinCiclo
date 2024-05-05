import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import {
  EventResizeDoneArg,
  EventDragStartArg,
} from "@fullcalendar/interaction";
import { DateSelectArg, EventClickArg, EventApi } from "@fullcalendar/core";
import { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import { doc, getDocs, onSnapshot, setDoc } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { getNombre, roles } from "../Login/TokenHandler";
import esLocale from "@fullcalendar/core/locales/es";
import { ModalDelete } from "./Modals/ModalDelete";
import { ModalAdd } from "./Modals/ModalAdd";

interface EventList {
  id: string;
  title: string;
  date: string;
  start: Date;
  range?: Range | null;
  userRoles: string;
  creator: string;
  color: string;
}

interface Range {
  start: Date;
  end: Date;
}

export const CalendarMain = () => {
  const saveToFirebase = async (data: any) => {
    try {
      const docRef = doc(db, "tarjetas", "calendario");
      const dataToSave = { lists: data };
      await setDoc(docRef, dataToSave);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [eventsToShow, setEventsToShow] = useState<EventList[]>();
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newDate, setNewDate] = useState<DateSelectArg>();
  const [newEvent, setNewEvent] = useState("");
  const [fireBaseEvents, setFireBaseEvents] = useState<EventList[]>();

  const handleEventClick = (arg: EventClickArg): void => {
    setShowDeleteConfirmation(true);
    setSelectedEventId(arg.event.id);
  };

  const handleConfirmDelete = () => {
    // Filtra los eventos eliminando el evento con el ID seleccionado
    if (fireBaseEvents) {
      const updatedEvents = fireBaseEvents.filter(
        (evento) => evento.id !== selectedEventId
      );
      setEventsToShow(updatedEvents);
      setFireBaseEvents(updatedEvents);
      setShowDeleteConfirmation(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "tarjetas", "calendario"), (doc) => {
      if (doc.exists()) {
        const data = doc.data().lists;
        setFireBaseEvents(data);
        const filteredData = data.filter(
          (event: any) =>
            event.creator == getNombre || event.userRoles == "ADMIN_ROLE"
        );
        console.log(filteredData);

        setEventsToShow(filteredData);
        console.log("Datos recibidos de Firebase:", data);
      } else {
        console.log("No hay datos en Firebase.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const saveEventsToFirestore = () => {
    if (fireBaseEvents) {
      saveToFirebase(fireBaseEvents);
    }
  };

  useEffect(() => {
    return () => {
      saveEventsToFirestore();
    };
  }, [fireBaseEvents]);

  useEffect(() => {
    saveEventsToFirestore();
  }, [fireBaseEvents]);

  const handleEventResize = (arg: EventResizeDoneArg) => {
    const { event, oldEvent } = arg;
  
    if (fireBaseEvents) {
      const updatedEvents = fireBaseEvents.map((fbEvent) => {
        if (fbEvent.id === event.id) {
          // Asegurarse de que event.start y event.end no sean null
          const rangeStart = event.start || new Date();
          const rangeEnd = event.end || new Date();
  
          // Si el ID del evento coincide con el evento redimensionado, actualiza la propiedad range
          return {
            ...fbEvent,
            range: { start: rangeStart, end: rangeEnd }
          };
        } else {
          // Si el ID no coincide, no se modifica este evento
          return fbEvent;
        }
      });
  
      saveToFirebase(updatedEvents);
      // Filtrar los elementos null de updatedEvents
      const filteredEvents = updatedEvents.filter((event) => event !== null);
  
      // Establecer el estado fireBaseEvents
      setFireBaseEvents(filteredEvents);
    }
  
    console.log("Evento redimensionado:", event.start, event.end);
    console.log("Fecha :", oldEvent.end, oldEvent.start);
    console.log("Fecha de fin:");
  };

  const handleNewEvent = () => {
    if (newDate) {
      const newEventList: EventList = {
        date: newDate.startStr || "",
        title: newEvent,
        id: nanoid(),
        start: new Date(),
        userRoles: roles,
        creator: getNombre,
        color: roles == "ADMIN_ROLE" ? "red" : "",
      };

      if (newEventList.range === null || newEventList.range === undefined) {
        delete newEventList.range;
      }
      if (eventsToShow && fireBaseEvents) {
        const list = [...eventsToShow, newEventList];
        const global = [...fireBaseEvents, newEventList];
        setFireBaseEvents(global);
        setEventsToShow(list);
        setShowAddEvent(false);
      }
    }
  };

  return (
    <div className="container mt-7 bg-white w-100">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        aspectRatio={2}
        dateClick={(arg: { dateStr: any }) => setShowAddEvent(true)}
        editable={true}
        selectable={true}
        events={eventsToShow?.map((event) => ({
          ...event,
          start: event.date,
          range: event.range
            ? { start: event.range.start, end: event.range.end }
            : undefined,
        }))}
        select={(arg: DateSelectArg) => setNewDate(arg)}
        eventClick={handleEventClick}
        eventResize={(arg: EventResizeDoneArg) => handleEventResize(arg)}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay",
        }}
        // eventColor='#378006'
      />

      <ModalDelete
        handleConfirmDelete={handleConfirmDelete}
        showDeleteConfirmation={showDeleteConfirmation}
        setShowDeleteConfirmation={setShowDeleteConfirmation}
      />
      <ModalAdd
        showAddEvent={showAddEvent}
        handleNewEvent={handleNewEvent}
        setShowAddEvent={setShowAddEvent}
        setNewEvent={setNewEvent}
      />
    </div>
  );
};
