import { Modal, Button } from "react-bootstrap";
import React, { MouseEvent } from "react";


interface ModalAddProps {
    setShowAddEvent: React.Dispatch<React.SetStateAction<boolean>>;
    showAddEvent: boolean;
    setNewEvent: Function,
    handleNewEvent: (event: MouseEvent<HTMLButtonElement>) => void
}

export const ModalAdd: React.FC<ModalAddProps> = ({
 
showAddEvent, setShowAddEvent,setNewEvent, handleNewEvent }) => {
    return (
        <Modal show={showAddEvent} onHide={() => setShowAddEvent(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Añadir evento</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <input
                    type="text"
                    onChange={(event) => setNewEvent(event.target.value)}
                />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddEvent(false)}>
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleNewEvent}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};