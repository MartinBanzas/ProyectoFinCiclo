import React, { useEffect, useState } from "react";
import UserModel from "../../../models/UserModel";
import { fetchResults } from "../../utils/UserDataRest";
import { getNombre } from "../Login/TokenHandler";
import { Link } from "react-router-dom";
import './custom.css'

interface UserProps {
  toggleUser:Function;
}

export const UsersBar: React.FC <UserProps> = ({toggleUser}) => {
  const [users, setUsers] = useState<UserModel[]>([]);
  const tuNombre = getNombre; 

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchResults();
        setUsers(result);
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };

    fetchData();
  }, []);

  

  return (
    <div className="container-fluid userbar text-white position-fixed mt-3 top-0 end-1 border-radius-xl bg-gradient-dark  ">
      <ul className="navbar-nav">
        <h6 className="text-white text-center">Usuarios</h6>
      {users.map((user: UserModel) => (
        tuNombre !== user.nombre ? (
          <div key={user.nombre} className=" nav-item p-2 text-center">
             <button onClick={()=>toggleUser(user.nombre)} className="btn btn-primary ms-1">{user.nombre}</button>
             <hr className="horizontal light mt-0 mb-2"/>
         
          </div>
        ) : null
      ))}
      </ul>
     
    </div>
  );
};
