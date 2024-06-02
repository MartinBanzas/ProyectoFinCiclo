import { Modal, Button } from "react-bootstrap";
import React, { useEffect, useState } from "react";
import { Message } from "../ProfileGeneral";
import { nanoid } from "nanoid";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getNombre, userId } from "../../Login/TokenHandler";
import { db } from "../../../utils/FirebaseConfig";
import unknown from "../../../../assets/icons/User_icon.png";
import "./ChatModal.css";

interface ChatModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  msgList: Message[];
  receiver: any;
  avatarSender: string;
  avatarReceiver: string | number;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  showModal,
  setShowModal,
  msgList,
  receiver,
  avatarSender,
  avatarReceiver,
}) => {
  const [inputText, setInputText] = useState("");
  const [orderedMsg, setOrderedMsg] = useState<Message[]>([]);

  const postNewMsg = async () => {
    const newMsg: Message = {
      key: nanoid(),
      sender: getNombre,
      body: inputText,
      receiver: receiver,
      date: new Date(), // Convertir a objeto Date
    };

    try {
      // Guarda el nuevo mensaje en Firebase
      const docRef = doc(db, "tarjetas", "mensajes");
      const docSnap = await getDoc(docRef);
      const data = docSnap.data()?.lists || [];
      const updatedData = [...data, newMsg];
      await setDoc(docRef, { lists: updatedData });

      // Limpia el texto de entrada
      setInputText("");

      // Actualiza el estado orderedMsg con el nuevo mensaje
      setOrderedMsg((prevMsgs) => [...prevMsgs, newMsg]);
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  useEffect(() => {
    const convertToMessage = (msg: any): Message => {
      if (msg.date && msg.date.seconds) {
        return {
          ...msg,
          date: new Date(
            msg.date.seconds * 1000 + msg.date.nanoseconds / 1000000
          ),
        };
      }
      return { ...msg, date: new Date(msg.date) };
    };

    const ordered = msgList
      .map(convertToMessage)
      .sort((a, b) => a.date.getTime() - b.date.getTime());

    setOrderedMsg(ordered);
  }, [msgList]);

  const formatDateTime = (date: Date) => {
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
    return date.toLocaleDateString("es-ES", options);
  };

  const yourAvatar = avatarSender != null ? avatarSender : unknown;
  const otherUser =
    avatarReceiver != undefined ? avatarReceiver.toString() : unknown;

  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Historial de mensajes</Modal.Title>
      </Modal.Header>
      <Modal.Body className="chat-modal-body">
        {orderedMsg?.map((message) => (
          <div
            key={message.key}
            className={getNombre === message.sender ? "sent" : "received"}
          >
            <div className="message-content">
              <img
                src={getNombre === message.sender ? yourAvatar : otherUser}
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
