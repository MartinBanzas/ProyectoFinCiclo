import React from 'react';
import { Button, Modal } from "react-bootstrap";

interface ConfirmModalProps {
  setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>;
  confirmModal: boolean;
  handleCerrar: () => void;
  tiempoTranscurrido: string;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({ setConfirmModal, confirmModal, handleCerrar, tiempoTranscurrido }) => {

  const handleButton = () => {
    console.log(tiempoTranscurrido)
    handleCerrar();
    setConfirmModal(false);
  };

  return (
    <Modal show={confirmModal} onHide={() => setConfirmModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Confirmar cierre de sesión</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Tu sesión lleva iniciada {tiempoTranscurrido}. ¿Estás seguro que deseas cerrar sesión? No podrás volver a iniciarla en el mismo día.
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setConfirmModal(false)}>
          Cancelar
        </Button>
        <Button variant="primary" onClick={handleButton}>
          Cerrar Sesión
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
