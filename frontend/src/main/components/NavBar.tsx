import { SpinnerLoading } from '../utils/SpinnerLoading'
import { Link } from 'react-router-dom'
export const NavBar = () => {
    return (
        <nav className="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl" id="navbarBlur" data-scroll="true">
        <div className="container-fluid py-1 px-3">
         
          <div className="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4" id="navbar">
            <div className="ms-md-auto pe-md-3 d-flex align-items-center">
                
                <div className="input-group input-group-outline">
                  <label className="form-label">Introduce para buscar</label>
                  <input type="text" className="form-control"/>
                </div>
                
            </div>
            <ul className="navbar-nav  justify-content-end">
            
              <li className="nav-item d-flex align-items-center">
              
                <Link to="/signIn" className="btn btn-outline-primary btn-sm mb-0 me-3">
                  <i className="fa fa-user me-sm-1"></i>
                  
                  <span className="d-sm-inline d-none">Iniciar sesión</span>
               
                </Link>
                 

                 
              </li>
             
            </ul>
          </div>
        </div>
      </nav>
      


    );
}



/*<button onClick={handleLogout} className="btn btn-outline-primary btn-sm mb-0 me-3">
                 <i className="fa fa-user me-sm-1"></i>
                 
                 <span className="d-sm-inline d-none">Cerrar sesión</span>
              
               </button>*/