import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

interface ModalRenameProps {
  showModalRename: boolean;
  setShowModalRename: React.Dispatch<React.SetStateAction<boolean>>;
  setNewName: React.Dispatch<React.SetStateAction<string>>;
  handleFileRename: () => void;

}

export const ModalRename: React.FC<ModalRenameProps> = ({
  handleFileRename,showModalRename, setShowModalRename,setNewName}) => {

  return (
    <Modal show={showModalRename} onHide={() => setShowModalRename(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Renombrar archivo</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <input
          type="text"
          onChange={(event) => setNewName(event.target.value)}
          autoFocus
        />
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowModalRename(false)}>Cancelar</Button>
        <Button variant="primary" onClick={handleFileRename}>Confirmar</Button>
      </Modal.Footer>
    </Modal>
  );
};
