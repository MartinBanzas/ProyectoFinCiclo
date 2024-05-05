import 'bootstrap/dist/css/bootstrap.min.css';
import linkedin from '../../assets/icons/linkedin.png';
import twitter from '../../assets/icons/twitter.png';
import github from '../../assets/icons/github.png';
import whatsapp from '../../assets/icons/whatsapp.png';
import { useLocation } from 'react-router-dom';

export const Footer = () => {
  const location = useLocation();

  const getTextColor = () => {
    const currentPath = location.pathname;
    return currentPath === '/login' ? 'text-white' : 'text-muted';
  };

  return (
    <footer className="footer py-4 fixed-bottom">
      <div className="container-fluid">
        <div className={`row align-items-center justify-content-lg-between ${getTextColor()}`}>
          <div className="col-lg-6 mb-lg-4">
            <div className={`copyright text-center text-sm ${getTextColor()}`}>
              © {new Date().getFullYear()}, hecho con <i className="fa fa-heart"></i> por {' '}
              <a href="https://www.linkedin.com/in/martin-antelo-jallas" className={`font-weight-bold ${getTextColor()}`} target="_blank" rel="noopener noreferrer">
                Martín Antelo Jallas
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <ul className="nav nav-footer justify-content-center justify-content-lg-end">
              <li className="nav-item">
                <a href="https://www.linkedin.com/in/martin-antelo-jallas" className={`nav-link ${getTextColor()}`} target="_blank" rel="noopener noreferrer">
                  <img src={linkedin} width="32px" height="32px" alt="LinkedIn" />
                </a>
              </li>
              <li className="nav-item">
                <a href="https://github.com/Atolmspek" className={`nav-link ${getTextColor()}`} target="_blank" rel="noopener noreferrer">
                  <img src={github} width="32px" height="32px" alt="GitHub" />
                </a>
              </li>
              <li className="nav-item">
                <a href="" className={`nav-link ${getTextColor()}`} target="_blank" rel="noopener noreferrer">
                  <img src={twitter} width="32px" height="32px" alt="Twitter" />
                </a>
              </li>
              <li className="nav-item">
                <a href="https://www.creative-tim.com/license" className={`nav-link pe-0 ${getTextColor()}`} target="_blank" rel="noopener noreferrer">
                  <img src={whatsapp} width="32px" height="32px" alt="WhatsApp" />
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};