import img from '../../../assets/img/_545f1248-ae29-4d9a-b1cd-e17347924342.jpeg'

import './custom.css'; // Importa tu archivo de estilos CSS

export const WelcomeScreen = () => {
  return (
    <div className="container-fluid text-white bg-gradient-dark border-radius-xl mt-3">
      <div className="welcome-text">
        <p className=" text-white text-center text-wrap">¡Bienvenido al chat de la empresa!. Selecciona un usuario para ver los mensajes</p>
      </div>
     
    </div>
    
  );
}