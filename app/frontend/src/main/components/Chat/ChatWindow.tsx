import React, { useEffect, useState } from "react";
import { getNombre } from "../Login/TokenHandler";
import { UsersBar } from "./UsersBar";
import { nanoid } from "nanoid";
import { setDoc, doc, onSnapshot, getDoc } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { Button, Modal } from "react-bootstrap";
import { WelcomeScreen } from "./WelcomeScreen";

interface Message {
  key: string;
  sender: string;
  body: string;
  receiver: string;
  date: Date;
}

export const ChatWindow = () => {
  const [fireBaseMessages, setFireBaseMessages] = useState<Message[]>();
  const [messagesToShow, setMessagesToShow] = useState<Message[]>();
  const [inputText, setInputText] = React.useState("");
  const [userSelected, setUserSelected] = React.useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const handleDoubleClick = (key:string) => {
    setShowDeleteConfirmation(true);
    setSelectedEventId(key);
  };



  const handleDelete = () => {
    setShowDeleteConfirmation(false);
    if (fireBaseMessages && selectedEventId) {
      const newArr = fireBaseMessages.filter(message => message.key !== selectedEventId);
      saveToFirebase(newArr);
      setFireBaseMessages(newArr);
     
      setMessagesToShow(newArr); 
      toggleUser(userSelected);
    
    }
  };


  const saveToFirebase = async (modifiedList:Message[]) => {
    const docRef = doc(db, "tarjetas", "mensajes");

   
    await setDoc(docRef, { lists: modifiedList });
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "tarjetas", "mensajes"), (doc) => {
      if (doc.exists()) {
        const data = doc.data().lists;
        setFireBaseMessages(data);
        setMessagesToShow(fireBaseMessages);
        toggleUser(userSelected);
        console.log("Datos recibidos de Firebase:", data);
      } else {
        console.log("No hay datos en Firebase.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const postNewMsg = async (event: any) => {
    const newMsg = {
      key: nanoid(),
      sender: getNombre, 
      body: inputText,
      receiver: userSelected,
      date:Date.now()
    };

    try {
      // Guarda el nuevo mensaje en Firebase
      const docRef = doc(db, "tarjetas", "mensajes");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data()?.lists || [];
      const updatedData = [...data, newMsg];
      await setDoc(docRef, { lists: updatedData });

      // Actualiza el estado local con el nuevo mensaje
      setFireBaseMessages(updatedData);

      // Actualiza el estado de los mensajes a mostrar
      const msgFromThisUser = updatedData.filter(
        (element) =>
          element.sender === userSelected ||
          (element.sender === getNombre && element.receiver === userSelected)
      );
      setMessagesToShow(msgFromThisUser);

      // Limpia el texto de entrada
      setInputText("");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  const toggleUser = (username: string) => {
    if (username=="") return;
    setMessagesToShow(() => {
      if (fireBaseMessages) {
        // Filtrar mensajes
        const msgFromThisUser = fireBaseMessages.filter(
          (element) =>
            element.sender === username ||
            (element.sender === getNombre && element.receiver === username)
        );

        setUserSelected(username);
        return msgFromThisUser;
      }
    });
  };

  const formatDateTime = (timestamp: any) => {
    const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "Europe/Madrid",
    };

    return new Date(timestamp).toLocaleDateString("es-ES", options);
  };
  return (
    <div className="container w-25">
      {userSelected === "" ? (
        <WelcomeScreen />
      ) : (
        <>
          {messagesToShow?.map((message) => (
            <div key={message.key} className="card mt-3">
              <div 
                onDoubleClick={() => handleDoubleClick(message.key)}
                className={`card-header ${
                  getNombre === message.sender ? "bg-secondary" : "bg-primary"
                } text-white`}
              >
                {getNombre === message.receiver
                  ? `${message.sender} escribió el ${message.date}`
                  : `El ${message.date} escribiste...`}
              </div>
              <div className="card-body">
                <p className="card-text">{message.body}</p>
              </div>
            </div>
          ))}
          <input
            type="text"
            className="form-text mt-3 w-100"
            onChange={(event) => setInputText(event?.target.value)}
            value={inputText}
            placeholder="Escribe aquí..."
          />
          <button className="btn btn-primary btn-sm mt-2" onClick={postNewMsg}>
            Enviar
          </button>
        </>
      )}
  
      <UsersBar toggleUser={toggleUser} />
  
      <Modal
        show={showDeleteConfirmation}
        onHide={() => setShowDeleteConfirmation(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Borrar mensaje</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Quieres eliminar el mensaje?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteConfirmation(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleDelete}>
            Confirmar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )};