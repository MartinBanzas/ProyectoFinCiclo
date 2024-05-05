import logo from '../../assets/img/logo-ct.png'
import { Link } from 'react-router-dom'


export const SideBar = () => {

  const handleLogout = () => {
      localStorage.removeItem("token");
      //localStorage.removeItem("")
      window.location.href = "http://localhost:3000/login";
  }

return (
    <aside className="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3   bg-gradient-dark" id="sidenav-main">

      <div className="sidenav-header">
        <i className="fas fa-times p-3 cursor-pointer text-white opacity-5 position-absolute end-0 top-0 d-none d-xl-none" aria-hidden="true" id="iconSidenav"></i>
        <Link className="navbar-brand m-0" to="./home" target="_blank">
          <img src={logo} className="navbar-brand-img h-100" alt="main_logo" />
          <span className="ms-1 font-weight-bold text-white">El hogar de la empresa</span>
        </Link>
      </div>


      <hr className="horizontal light mt-0 mb-2"/>

        <div className="collapse navbar-collapse  w-auto " id="sidenav-collapse-main">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link className="nav-link text-white " to="./home">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">upload</i>
                </div>

                <span className="nav-link-text ms-1">Archivos</span>
              </Link>
            </li>


            <li className="nav-item">
              <Link className="nav-link text-white " to="./trello">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">table_view</i>
                </div>

                <span className="nav-link-text ms-1">Tareas cooperativas</span>
              </Link>
            </li>


            <li className="nav-item">
              <Link className="nav-link text-white " to="./conversor">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">receipt_long</i>
                </div>

                <span className="nav-link-text ms-1">Utilidades</span>
              </Link>
            </li>


            <li className="nav-item">
              <Link className="nav-link text-white " to="./tetris">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">view_in_ar</i>
                </div>

                <span className="nav-link-text ms-1">Tetris</span>
              </Link>
            </li>


            <li className="nav-item">
              <Link className="nav-link text-white " to="./calendar">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">calendar_month</i>
                </div>

                <span className="nav-link-text ms-1">Calendario</span>
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link text-white " to="./weather">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">thermostat</i>
                </div>

                <span className="nav-link-text ms-1">El Tiempo</span>
              </Link>
            </li>


            <li className="nav-item">
              <Link className="nav-link text-white " to="./messages">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">notifications</i>
                </div>

                <span className="nav-link-text ms-1">Mensajes</span>
              </Link>
            </li>


            <li className="nav-item mt-3">
              <h6 className="ps-4 ms-2 text-uppercase text-xs text-white font-weight-bolder opacity-8">Personal</h6>
            </li>

            <li className="nav-item">
            <Link className="nav-link text-white " to="./profile">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">person</i>
                </div>

                <span className="nav-link-text ms-1">Mi perfil</span>
              </Link>
            </li>
        


            <li className="nav-item">
              <a className="nav-link text-white " onClick={handleLogout}>

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">login</i>
                </div>

                <span className="nav-link-text ms-1">Cerrar sesión</span>
            
              </a>
            </li>


            <li className="nav-item">
            <Link className="nav-link text-white " to="./about">

                <div className="text-white text-center me-2 d-flex align-items-center justify-content-center">
                  <i className="material-icons opacity-10">assignment</i>
                </div>

                <span className="nav-link-text ms-1">Acerca de</span>
              </Link>
            </li>

          </ul>
        </div>

        <div className="sidenav-footer position-absolute w-100 bottom-0 ">
          <div className="mx-3">
           
            <a className="btn bg-gradient-primary w-100" href="https://www.creative-tim.com/product/material-dashboard-pro?ref=sidebarfree" type="button">Documentación</a>
          </div>

        </div>
    </aside>
 

);



}