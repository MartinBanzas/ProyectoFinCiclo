import { Modal, Button } from "react-bootstrap";
import React from "react";
import UserModel from "../../../../models/UserModel";
import unknown from "../../../../assets/icons/User_icon.png";

interface ProfileModalProps {
  setOtherProfileModal: React.Dispatch<React.SetStateAction<boolean>>;
  otherProfileModal: boolean;
  user: UserModel | null;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  setOtherProfileModal,
  otherProfileModal,
  user
}) => {

  return (
    <Modal show={otherProfileModal} onHide={() => setOtherProfileModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Información del Perfil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {user ? (
          <>
            <div className="d-flex flex-column align-items-center text-center">
              <img
                src={user.avatar ? user.avatar : unknown}
                alt="Profile"
                className="rounded-circle"
                width="150"
              />
              <div className="mt-3">
                <h4>{user.nombre}</h4>
                <p className="text-secondary mb-1">{user.bio ? user.bio : "Sin biografía"}</p>
                <p className="text-muted font-size-sm">{user.email}</p>
              </div>
            </div>
            <ul className="list-group list-group-flush">
              {user.facebook && (
                <li className="list-group-item">
                  <strong>Facebook:</strong> {user.facebook}
                </li>
              )}
              {user.twitter && (
                <li className="list-group-item">
                  <strong>Twitter:</strong> {user.twitter}
                </li>
              )}
              {user.instagram && (
                <li className="list-group-item">
                  <strong>Instagram:</strong> {user.instagram}
                </li>
              )}
              {user.movil && (
                <li className="list-group-item">
                  <strong>Móvil:</strong> {user.movil}
                </li>
              )}
            </ul>
          </>
        ) : (
          <p>No hay información del usuario.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => setOtherProfileModal(false)}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};