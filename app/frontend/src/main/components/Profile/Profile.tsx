import { useCallback, useEffect } from "react";
import { get_all_users } from "../../utils/UserDataRest";
import UserModel from "../../../models/UserModel";
import React from "react";
import { getNombre, userId } from "../Login/TokenHandler";
import { onSnapshot, doc } from "firebase/firestore";
import { db } from "../../utils/FirebaseConfig";
import { SpinnerLoading } from "../../utils/SpinnerLoading";
import { ChatModal } from "./Modals/ChatModal";
import { EditModal } from "./Modals/EditModal";
import { AvatarModal } from "./Modals/AvatarModal";
import unknown from "../../../assets/icons/User_icon.png";
import { ProfileModal } from "./Modals/ProfileModal";

export interface Message {
  key: string;
  sender: string;
  body: string;
  receiver: string;
  date: Date;
}

export const Profile = () => {
  const [selectedUser, setSelectedUser] = React.useState<UserModel>();
  const [mainUser, setMainUser] = React.useState<UserModel>();
  const [otherUsers, setOtherUsers] = React.useState<UserModel[]>([]);
  const [fireBaseMessages, setFireBaseMessages] = React.useState<Message[]>([]);
  const [isReady, setIsReady] = React.useState<boolean>(false);
  const [chatModal, setChatModal] = React.useState(false);
  const [editModal, setEditModal] = React.useState(false);
  const [profileModal, setProfileModal] = React.useState(false);
  const [msgFromThisUser, setMsgFromThisUser] = React.useState<Message[]>([]);
  const [avatarModal, setAvatarModal] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const [userImageUrls, setUserImageUrls] = React.useState<{
    [key: number]: string;
  }>({});

  const updateUser = useCallback(
    async (
      inputBio: string,
      inputPhone: number,
      inputTwitter: string,
      inputFacebook: string,
      inputInstagram: string
    ) => {
      try {
        const bodyData = {
          newFacebook: inputFacebook ? inputFacebook : mainUser?.facebook,
          newTwitter: inputTwitter ? inputTwitter : mainUser?.twitter,
          newInstagram: inputInstagram ? inputInstagram : mainUser?.instagram,
          newPhone: inputPhone ? inputPhone : mainUser?.movil,
          newBio: inputBio ? inputBio : mainUser?.bio,
        };

        console.log(inputPhone);

        const response = await fetch(
          `http://localhost:5000/auth/updateUserData/${userId}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(bodyData),
          }
        );

        if (response.ok) {
          const responseBody = await response.text();
          console.log(responseBody);
        }
      } catch (error) {
        console.log("Error actualizando el recurso");
      }
    },
    []
  );

  const handleAvatarUpload = useCallback(
    async (file: File) => {
      if (!file) {
        console.error("No se ha seleccionado ningún archivo");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      try {
        console.log(userId);
        const response = await fetch(
          `http://localhost:5000/drive/avatar/${userId}`,
          {
            method: "POST",
            body: formData,
          }
        );
        console.log(response);
        if (response.ok) {
          console.log("Archivo subido exitosamente");
          setAvatarModal(false);
        } else {
          console.error("Error al subir el archivo");
        }
      } catch (error) {
        console.error("Error al subir el archivo", error);
      }
    },
    [userId]
  );

  const handleChatModal = (username: string) => {
    const msgFromThisUser = fireBaseMessages.filter(
      (element) =>
        (element.sender === username && element.receiver === getNombre) ||
        (element.sender === getNombre && element.receiver === username)
    );
    msgFromThisUser.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });
    setMsgFromThisUser(msgFromThisUser);
    setChatModal(true);
  };

  const handleProfileModal = (user: UserModel) => {
    setSelectedUser(user);
    setProfileModal(true);
  };

  const lastMsg = (username: string) => {
    const msgFromThisUser = fireBaseMessages.filter(
      (element) =>
        (element.sender === username && element.receiver === getNombre) ||
        (element.sender === getNombre && element.receiver === username)
    );
    msgFromThisUser.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Devolver el primer mensaje del array, que será el más reciente
    const currentlastMsg = msgFromThisUser[0];
    return currentlastMsg === undefined
      ? "Aún no hay mensajes con este usuario"
      : currentlastMsg.body;
  };

  //useEffects para obtener mensajes, filtrarlos...desde Firebase.
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "tarjetas", "mensajes"), (doc) => {
      if (doc.exists()) {
        const data = doc.data().lists;
        setFireBaseMessages(data);
        console.log("Datos recibidos de Firebase:", data);
        setIsReady(true);
      } else {
        console.log("No hay datos en Firebase.");
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      const all_users = await get_all_users();
      const mainUser = all_users.find((user) => user.nombre === getNombre);
      console.log(mainUser);
      const otherUsers = all_users.filter((user) => user.nombre !== getNombre);
      setOtherUsers(otherUsers);
      if (mainUser) {
        setMainUser(mainUser);
      }
    };
    fetchUserData();
  }, []);

  const fetchImage = async (id: Number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/drive/get/avatar/${id}`,
        {
          method: "GET",
        }
      );
      if (response.ok) {
        const blob = await response.blob();
        if (id == userId) {
          setImageUrl(URL.createObjectURL(blob));
          console.log(blob);
        }
        return URL.createObjectURL(blob); // Return the URL for other users
      } else {
        console.error("Error al obtener la imagen");
        setImageUrl(unknown)
        return unknown; // Return the unknown image for other users
      }
    } catch (error) {
      console.error("Error al realizar la solicitud:", error);
      return unknown; // Return the unknown image for other users in case of an error
    }
  };

  useEffect(() => {
    fetchImage(userId);
  }, []);

  useEffect(() => {
    const fetchUserImages = async () => {
      const urls: { [key: number]: string } = {};
      for (const user of otherUsers) {
        try {
          const url = await fetchImage(user.id);
          if (url) {
            // Verificar si la URL no es undefined
            urls[user.id] = url;
          } else {
            console.error(
              `La URL de imagen para el usuario ${user.id} es undefined`
            );
          }
        } catch (error) {
          console.error(`Error fetching image for user ${user.id}:`, error);
        }
      }
      setUserImageUrls(urls);
    };

    fetchUserImages();
  }, [otherUsers]);

  return isReady ? (
    <div className="container-fluid px-2 px-md-7 main-content w-auto">
      <div
        className="page-header min-height-300 border-radius-xl mt-4"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1531512073830-ba890ca4eba2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80")',
        }}
      >
        <span className="mask  bg-gradient-primary opacity-6" />
      </div>
      <div className="card card-body mx-3 mx-md-4 mt-n6">
        <div className="row gx-4 mb-2">
          <div className="col-auto">
            <div className="avatar avatar-xl position-relative">
              <img
                src={imageUrl != null ? imageUrl : unknown}
                alt="Imagen de perfil del usuario"
                className="w-100 border-radius-lg shadow-sm"
                onDoubleClick={() => setAvatarModal(true)}
              />
            </div>
          </div>
          <div className="col-auto my-auto">
            <div className="h-100">
              <h5 className="mb-1">{mainUser?.nombre}</h5>
              <p className="mb-0 font-weight-normal text-sm">
                CEO / Co-Founder
              </p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 my-sm-auto ms-sm-auto me-sm-0 mx-auto mt-3">
            <div className="nav-wrapper position-relative end-0">
              <ul className="nav nav-pills nav-fill p-1" role="tablist">
                <li className="nav-item">
                  <a
                    className="nav-link mb-0 px-0 py-1 active "
                    data-bs-toggle="tab"
                    href=""
                    role="tab"
                    aria-selected="true"
                  >
                    <i className="material-icons text-lg position-relative">
                      home
                    </i>
                    <span className="ms-1">App</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link mb-0 px-0 py-1 "
                    data-bs-toggle="tab"
                    href=""
                    role="tab"
                    aria-selected="false"
                  >
                    <i className="material-icons text-lg position-relative">
                      email
                    </i>
                    <span className="ms-1">Mensajes</span>
                  </a>
                </li>
                <li className="nav-item">
                  <a
                    className="nav-link mb-0 px-0 py-1 "
                    data-bs-toggle="tab"
                    href=""
                    role="tab"
                    aria-selected="false"
                  >
                    <i className="material-icons text-lg position-relative">
                      settings
                    </i>
                    <span className="ms-1">Configuración</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="row">
            <div className="col-12 col-xl-4">
              <div className="card card-plain h-100">
                <div className="card-header pb-0 p-3">
                  <h6 className="mb-0">Información de perfil</h6>
                </div>
                <div className="card-body p-3">
                  <h6 className="text-uppercase text-body text-xs font-weight-bolder">
                    Redes sociales
                  </h6>
                  <ul className="list-group">
                    <li className="list-group-item border-0 px-0">
                      <div className="form-check form-switch ps-0">
                        <a
                          className="btn btn-twitter btn-simple mb-0 ps-1 pe-2 py-0"
                          href={`https://www.twitter.com/${mainUser?.twitter}`}
                        >
                          <i className="fab fa-twitter fa-xl fa-lg" />
                        </a>
                        {mainUser?.twitter != null
                          ? mainUser.twitter
                          : "Edita tu perfil para añadirlo"}
                      </div>
                    </li>
                    <li className="list-group-item border-0 px-0">
                      <div className="form-check form-switch ps-0">
                        <a
                          className="btn btn-facebook btn-simple mb-0 ps-1 pe-2 py-0"
                          href={`https://www.twitter.com/${mainUser?.facebook}`}
                        >
                          <i className="fab fa-facebook fa-lg" />
                        </a>
                        {mainUser?.facebook != null
                          ? mainUser.facebook
                          : "Edita tu perfil para añadirlo"}
                      </div>
                    </li>

                    <li className="list-group-item border-0 px-0">
                      <div className="form-check form-switch ps-0">
                        <a
                          className="btn btn-instagram btn-simple mb-0 ps-1 pe-2 py-0"
                          href={`https://www.instagram.com/${mainUser?.instagram}`}
                        >
                          <i className="fab fa-instagram fa-lg" />
                        </a>
                        {mainUser?.instagram != null
                          ? mainUser.instagram
                          : "Edita tu perfil para añadirlo"}
                      </div>
                    </li>
                  </ul>
                  <h6 className="text-uppercase text-body text-xs font-weight-bolder mt-3">
                    Teléfono
                  </h6>

                  {mainUser?.movil != null
                    ? mainUser?.movil
                    : "Edita tu perfil para añadirlo"}
                  <h6 className="text-uppercase text-body text-xs font-weight-bolder mt-3">
                    Correo electrónico
                  </h6>
                  {mainUser?.email}
                </div>
              </div>
            </div>
            <div className="col-12 col-xl-4">
              <div className="card card-plain h-100">
                <div className="card-header pb-0 p-3">
                  <div className="row">
                    <div className="col-md-8 d-flex align-items-center">
                      <h6 className="mb-0">Datos biográficos</h6>
                    </div>
                    <div className="col-md-4 text-end">
                      <a onClick={() => setEditModal(true)}>
                        <i
                          className="fas fa-user-edit text-secondary text-sm"
                          data-bs-toggle="tooltip"
                          data-bs-placement="top"
                          title="Editar perfil"
                        />
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card-body p-3">
                  <p className="text-sm">{mainUser?.bio}</p>
                  <hr className="horizontal gray-light my-4" />
                  <ul className="list-group">
                    <li className="list-group-item border-0 ps-0 pt-0 text-sm">
                      <strong className="text-dark">Nombre completo:</strong>{" "}
                      &nbsp;
                      {mainUser?.nombre}
                    </li>

                    <li className="list-group-item border-0 ps-0 text-sm">
                      <strong className="text-dark">Email:</strong> &nbsp;
                      {mainUser?.email}
                    </li>
                    <li className="list-group-item border-0 ps-0 text-sm">
                      <strong className="text-dark">País:</strong> &nbsp; España
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-12 col-xl-4">
              <div className="card card-plain h-100">
                <div className="card-header pb-0 p-3">
                  <h6 className="mb-0">Mensajes y usuarios</h6>
                </div>
                <div className="card-body p-3">
                  <ul className="list-group">
                    {otherUsers.map((user) => (
                      <li
                        className="list-group-item border-0 d-flex align-items-center px-0 mb-2 pt-0"
                        key={user.nombre}
                      >
                        <div className="avatar me-3">
                          <img
                            src={
                              user.avatar == null
                                ? unknown
                                : userImageUrls[user.id]
                            }
                            alt="kal"
                            className="border-radius-lg shadow"
                            width={"10px"}
                          />
                        </div>
                        <div className="d-flex align-items-start flex-column justify-content-center w-75">
                          <h6 className="mb-0 text-sm">{user.nombre}</h6>
                          <p className="mb-0 text-xs">{lastMsg(user.nombre)}</p>
                          <ChatModal
                            setShowModal={setChatModal}
                            receiver={user.nombre}
                            showModal={chatModal}
                            msgList={msgFromThisUser}
                            avatarSender={imageUrl}
                            avatarReceiver={userImageUrls[user.id]}
                          />
                        </div>

                        <ProfileModal
                          setShowModal={setProfileModal}
                          profileModal={profileModal}
                          user={selectedUser || null}

                        />

                        <a
                          onClick={() => handleChatModal(user.nombre)}
                          className="text-xs btn btn-sm btn-link pe-3 ps-0 mb-0 ms-auto w-25 w-md-auto"
                        >
                          <i className="material-icons text-lg position-relative">
                            email
                          </i>
                        </a>

                        <a onClick={() => handleProfileModal(user)}>
                          <i
                            className="fas fa-user text-secondary text-sm"
                            data-bs-toggle="tooltip"
                            data-bs-placement="top"
                            title="Ver perfil"
                          />
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AvatarModal
        setAvatarModal={setAvatarModal}
        avatarModal={avatarModal}
        handleImgUpload={handleAvatarUpload}
      />
      <EditModal
        setEditModal={setEditModal}
        editModal={editModal}
        updateUser={updateUser}
        mainUser={mainUser}
      />
    </div>
  ) : (
    <SpinnerLoading />
  );
};