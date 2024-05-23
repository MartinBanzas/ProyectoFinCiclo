export const About = () => {
    return (
      <div className="container-md text-center bg-white mt-6 rounded">
        <div className="mt-2 card-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div className="bg-gradient-success shadow-success border-radius-lg pt-4 pb-3">
            <h6 className="text-white text-capitalize ps-3">Acerca de</h6>
          </div>
        </div>
        <div className="mt-5 text-start px-5">
          <p className="fs-5">
            Empecé este proyecto para practicar React. Fue creciendo y se ha
            convertido en lo que espero que sea mi proyecto de fin de ciclo.
            Utiliza las siguientes librerías y componentes:
          </p>
          <ul className="list-unstyled mt-4">
            <li>
              <a href="https://github.com/react-dropzone/react-dropzone/" className="text-decoration-none">
                <span className="fw-bold">React-Dropzone:</span> para hacer una zona en la que se pueden soltar archivos en el componente Drive, bajo licencia MIT
              </a>
            </li>
            <li>
              <a href="https://github.com/atlassian/react-beautiful-dnd" className="text-decoration-none">
                <span className="fw-bold">React-beautiful-dnd:</span> para permitir efecto visual de arrastre entre listas en Trello, licencia Apache
              </a>
            </li>
            <li>
              <a href="https://fullcalendar.io/" className="text-decoration-none">
                <span className="fw-bold">FullCalendar.io:</span> para el módulo del calendario. Licencia MIT
              </a>
            </li>
            <li>
        
              <a href="https://www.creative-tim.com/product/material-dashboard" className="text-decoration-none">
                <span className="fw-bold">Material Dashboard de Creative Tim</span>
              </a> como tema de Bootstrap, bajo licencia MIT
            </li>
          </ul>
        </div>
        <div className="mt-5 text-start px-5">
          <p className="fs-5">
            APIs de terceros empleadas:
          </p>
          <ul className="list-unstyled mt-4">
            <li>
              <span className="fw-bold text-bold">Frankfurter:</span> para la obtención de tasas de intercambio de las monedas
            </li>
            <li>
              <span className="fw-bold">OpenWeatherMap:</span> para meteorología
            </li>
          </ul>
        </div>
      </div>
    );
  };