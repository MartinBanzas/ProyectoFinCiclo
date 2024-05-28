import { Modal, Button } from "react-bootstrap";
import React, { useEffect } from "react";
import { Message } from "../Profile";
import { nanoid } from "nanoid";
import { setDoc, doc, getDoc } from "firebase/firestore";
import { getNombre, userId } from "../../Login/TokenHandler";
import { db } from "../../../utils/FirebaseConfig";
import unknown from "../../../../assets/icons/User_icon.png";
import "./ChatModal.css"; // Import the CSS file for styling
import UserModel from "../../../../models/UserModel";

interface ChatModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  showModal: boolean;
  msgList: Message[];
  receiver: any;
  avatarSender: string;
}

export const ChatModal: React.FC<ChatModalProps> = ({
  showModal,
  setShowModal,
  msgList,
  receiver,
 
}) => {
  const [inputText, setInputText] = React.useState("");
  const [senderAvatar, setSenderAvatar] = React.useState("");
  const [receiverAvatar, setReceiverAvatar] = React.useState("");

  useEffect(() => {
    if (receiver !=null) {
    fetchImage(receiver.id);
    fetchImage(userId);}
  }, [receiver]); 

  const postNewMsg = async () => {
    const newMsg = {
      key: nanoid(),
      sender: getNombre,
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

      // Limpia el texto de entrada
      setInputText("");
    } catch (error) {
      console.error("Error al guardar en Firestore:", error);
    }
  };

  const fetchImage = async (id: Number) => {
    console.log(receiver.id)
    console.log(userId)
    try {
      const response = await fetch(
        `http://localhost:5000/drive/get/avatar/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const blob = await response.blob();

        if (id==userId) {
          setSenderAvatar(URL.createObjectURL(blob))
        } else {
          setReceiverAvatar(URL.createObjectURL(blob))
        }
        //set(URL.createObjectURL(blob));
        //console.log(avatar);

        return URL.createObjectURL(blob);
      } else {
        if (!receiverAvatar) setReceiverAvatar(unknown)
          //Meter aquí una imagen por defecto para sender
        console.error("Error al obtener la imagen");
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
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

  const yourAvatar = senderAvatar != null ? senderAvatar : unknown
  const otherUser = receiverAvatar != undefined ? receiverAvatar : unknown
  console.log(receiverAvatar)


  return (
    <Modal show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Historial de mensajes</Modal.Title>
      </Modal.Header>
      <Modal.Body className="chat-modal-body">
        {msgList.map((message) => (
          <div
            key={nanoid()}
            className={getNombre === message.sender ? "sent" : "received"}
          >
            <div className="message-content">
              <img src={getNombre === message.sender ? yourAvatar : otherUser} alt="Avatar" className="message-avatar" />
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
