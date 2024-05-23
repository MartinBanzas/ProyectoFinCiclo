import { Modal, Button } from "react-bootstrap";
import React, { MouseEvent } from "react";
import { Message } from "../Profile";
import { nanoid } from "nanoid";
import { setDoc, doc, onSnapshot, getDoc } from "firebase/firestore";
import { getNombre } from "../../Login/TokenHandler";
import { db } from "../../../utils/FirebaseConfig";
import unknown from "../../../../assets/icons/User_icon.png";
import './ChatModal.css'; // Import the CSS file for styling

interface ChatModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  msgList: Message[];
  receiver: string;
  avatarSender: string;
  avatarReceiver: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  showModal,
  setShowModal,
  msgList,
  receiver,
  avatarSender,
  avatarReceiver,
}) => {
  const [inputText, setInputText] = React.useState("");

  console.log(avatarSender);

  const postNewMsg = async (event: any) => {
    const newMsg = {
      key: nanoid(),
      sender: getNombre(),
      body: inputText,
      receiver: receiver,
      date: Date.now(),
    };

    try {
      // Guarda el nuevo mensaje en Firebase
      const docRef = doc(db, "tarjetas", "mensajes");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data()?.lists || [];
      const updatedData = [...data, newMsg];
      await setDoc(docRef, { lists: updatedData });

      // Actualiza el estado local con el nuevo mensaje
      // Actualiza el estado de los mensajes a mostrar
      const msgFromThisUser = updatedData.filter(
        (element) =>
          element.sender === receiver ||
          (element.sender === getNombre() && element.receiver === receiver)
      );
      setShowModal(false);
      // Limpia el texto de entrada
      setInputText("");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
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

  // Examina que los avatares que se le pasan están definidos, en caso contrario, coge el por defecto.
  avatarReceiver = avatarReceiver || unknown;
  avatarSender = avatarSender || unknown;

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Historial de mensajes</Modal.Title>
      </Modal.Header>
      <Modal.Body className="chat-modal-body">
        {msgList.map((message) => (
          <div
            key={message.key}
            className={`message ${
              getNombre === message.sender ? "sent" : "received"
            }`}
          >
            <div className="message-content">
              
              <img
                src={
                  getNombre === message.sender ? avatarSender : avatarReceiver
                }
                alt="Avatar"
                className="message-avatar"
              />
              <div className="message-text">
                <p>{message.body}</p>
                <small className="message-time">
                  {formatDateTime(message.date)}
                </small>
              </div>
            </div>
          </div>
        ))}

        <input
          id="messageBody"
          className="message-input mt-2"
          type="text"
          placeholder="Escribe aquí..."
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModal(false)}>
          Cerrar
        </Button>
        <Button variant="primary" onClick={postNewMsg}>
          Enviar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};