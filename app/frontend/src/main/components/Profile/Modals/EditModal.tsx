import React from "react";
import { Button, Modal } from "react-bootstrap";
import UserModel from "../../../../models/UserModel";

interface EditModalProps {
  setEditModal: React.Dispatch<React.SetStateAction<boolean>>;
  editModal: boolean;
  updateUser: Function;
  mainUser: UserModel | undefined
}

export const EditModal: React.FC<EditModalProps> = ({
  setEditModal,
  editModal,
  updateUser,
  mainUser
}) => {

  const [inputBio,setInputBio]= React.useState("")
  const [inputPhone, setInputPhone]=React.useState("");
  const [inputTwitter, setInputTwitter]=React.useState("")
  const [inputFacebook, setInputFacebook]=React.useState("")
  const [inputInstagram, setInputInstagram]=React.useState("")

  const handleEdit = () => {
    setEditModal(false);
    updateUser(inputBio, inputPhone, inputTwitter, inputFacebook, inputInstagram)
  };

  return (
    <Modal show={editModal} onHide={() => setEditModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Datos del perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="card card-body container justify-content-center">
   
       
          <label
            className="h6 display-6 form-check-label text-body text-truncate w-80 mt-2"
            htmlFor="phone"
          >Teléfono
          </label>
          <input id="phone" placeholder={mainUser?.movil !=null ? mainUser.movil.toString() : "Introduce tu móvil"}className="mb-1" type="text" onChange={(event)=>setInputPhone(event?.target.value)}/>
          <label
            className="h6 display-6 form-check-label text-body text-truncate w-80 mt-2"
            htmlFor="phone"
          >Twitter
          </label>
          <input id="twitter" placeholder={mainUser?.twitter !=null ? mainUser.twitter : "Introduce tu cuenta de X/Twitter"} className="mb-1" type="text" onChange={(event)=>setInputTwitter(event?.target.value)}/>

          <label
            className="h6 display-6 form-check-label text-body text-truncate w-80 mt-2"
            htmlFor="phone"
          >Facebook
          </label>
          <input id="facebook" placeholder={mainUser?.facebook != null ? mainUser.facebook : "Introduce tu cuenta de Facebook"} className="mb-1" type="text" onChange={(event)=>setInputFacebook(event?.target.value)}/>

          <label
            className="h6 display-6 form-check-label text-body text-truncate w-80 mt-2"
            htmlFor="phone"
          >Instagram
          </label>
          <input id="instagram" placeholder={mainUser?.instagram !=null ? mainUser.instagram : "Introduce tu cuenta de Instagram"} className="mb-1" type="text" onChange={(event)=>setInputInstagram(event?.target.value)}/>

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
