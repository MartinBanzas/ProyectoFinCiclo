import React from "react";
import { Button, Modal } from "react-bootstrap";

interface EditModalProps {
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  editModal: boolean;
  updateUser: Function;
}

export const EditModal: React.FC<EditModalProps> = ({
  setEditModal,
  editModal,
  updateUser
}) => {
  const [inputEmail, setInputEmail] = React.useState("");
  const [inputBio,setInputBio]= React.useState("")
  const [inputPhone, setInputPhone]=React.useState("");

  const handleEdit = () => {
    setEditModal(false);
    updateUser(inputEmail, inputBio, inputPhone)
  };

  return (
    <Modal show={editModal} onHide={() => setEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Datos del perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card card-body container justify-content-center">
   
        
          <label
            className="h6 display-6 form-check-label text-body text-truncate w-80 "
            htmlFor="email"
          >
            Email
          </label>
          <input
            className="mt-0"
            type="text"
            onChange={(event) => setInputEmail(event.target.value)}
            id="email"
          />
          <label
            className="h6 display-6 form-check-label text-body text-truncate w-80 mt-2"
            htmlFor="phone"
          >Teléfono
          </label>
          <input id="phone" className="mb-1" type="text" onChange={(event)=>setInputPhone(event?.target.value)}/>
          <label className="h6 display-6 form-check-label text-body text-truncate w-80" htmlFor="bio">Biografía</label>
          <textarea id="bio" onChange={(event)=>setInputBio(event.target.value)}></textarea>
       
       </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setEditModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleEdit}>
          Guardar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
