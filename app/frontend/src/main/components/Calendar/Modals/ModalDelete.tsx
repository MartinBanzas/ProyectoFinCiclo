import { Modal, Button } from "react-bootstrap";
import React, { MouseEvent } from "react";

interface CalendarModalDelete {
    showDeleteConfirmation: boolean,
    setShowDeleteConfirmation: Function,
    handleConfirmDelete: (event: MouseEvent<HTMLButtonElement>) => void
}
export const ModalDelete: React.FC<CalendarModalDelete> = ({
    showDeleteConfirmation,
    setShowDeleteConfirmation,
    handleConfirmDelete,
}) => {
    return (
        <Modal
            show={showDeleteConfirmation}
            onHide={() => setShowDeleteConfirmation(false)} // Corrección aquí
        >
            <Modal.Header closeButton>
                <Modal.Title>Borrar evento</Modal.Title>
            </Modal.Header>
            <Modal.Body>¿Quieres eliminar el evento?</Modal.Body>
            <Modal.Footer>
                <Button
                    variant="secondary"
                    onClick={() => setShowDeleteConfirmation(false)}
                >
                    Cancelar
                </Button>
                <Button variant="primary" onClick={handleConfirmDelete}>
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};