import { Modal, Button } from "react-bootstrap";
import React, { useEffect } from "react";
import { Message } from "../Profile";
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
  avatarReceiver: string | number
}

export const ChatModal: React.FC<ChatModalProps> = ({
  showModal,
  setShowModal,
  msgList,
  receiver,
  avatarSender,
  avatarReceiver
 
}) => {
  const [inputText, setInputText] = React.useState("");
  const [senderAvatar, setSenderAvatar] = React.useState("");
  const [receiverAvatar, setReceiverAvatar] = React.useState("");


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



useEffect(()=> {
  msgList.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateA.getTime() - dateB.getTime();
  })
  console.log(msgList)
}, [msgList])



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

  const yourAvatar = avatarSender != null ? avatarSender : unknown
  const otherUser = avatarReceiver != undefined ? avatarReceiver : unknown
  console.log(receiverAvatar)
  console.log(senderAvatar)


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
            <img src={getNombre === message.sender ? yourAvatar : otherUser.toString()} alt="Avatar" className="message-avatar" />              <div className="message-text">
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
