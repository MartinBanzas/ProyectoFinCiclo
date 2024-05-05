import React from "react";
import { Button, Modal } from "react-bootstrap";

interface AvatarModalProps {
  setAvatarModal: React.Dispatch<React.SetStateAction<boolean>>;
  avatarModal: boolean;
  handleImgUpload: Function;
}

export const AvatarModal: React.FC<AvatarModalProps> = ({
  setAvatarModal,
  avatarModal,
  handleImgUpload,
}) => {

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    setSelectedFile(file);
  };

  const handleButton = () => {
    if (selectedFile) {
      handleImgUpload(selectedFile);
    }
  };

  return (
    <Modal show={avatarModal} onHide={() => setAvatarModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Editar imagen de perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="input-group">
          <input type="file" onChange={handleFileChange} className="" />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setAvatarModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleButton}>
          Subir
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
