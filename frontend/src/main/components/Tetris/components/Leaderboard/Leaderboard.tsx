import React from "react";
import UserModel from "../../../../../models/UserModel";
import { Button, Modal } from "react-bootstrap";

interface LeaderboardProps {
    isOpen: boolean;
    handleClose: () => void; // Hay que especificar el tipo de handleClose más precisamente o TypeScript se queja
    playerList: UserModel[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ isOpen, handleClose, playerList }) => {

    return (
        <Modal show={isOpen} backdrop="static">
            <Modal.Header closeButton>
                <Modal.Title>Tabla de clasificaciones</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <table className="container table table-striped table-light align-items-center">
                    <thead>
                        <tr>
                            <th scope="col">Nombre</th>
                            <th scope="col">Puntuación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {playerList.map((player) => (
                            <tr key={player.puntuacion}>
                                <td>{player.nombre}</td>
                                <td>{player.puntuacion}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <Button variant="primary" onClick={handleClose}>Cerrar</Button>
            </Modal.Body>
        </Modal>
    );
};