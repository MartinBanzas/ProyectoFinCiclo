import React, { useCallback } from "react";
import img from "../../../assets/img/illustrations/illustration-signup2.jpg";
import './extra.css'
import { FormValidation } from "./FormValidation";
import { azure_frontend, azure_backend } from "../../urls";
export const Register = () => {
  // // style="background-image: url('../assets/img/illustrations/illustration-signup.jpg'); background-size: cover;">

  const [labelLogin, setLabelLogin] = React.useState(
    "Nombre de inicio de sesión"
  );

  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [email, setEmail] = React.useState("");

  const [validationNombre, setValidationNombre] = React.useState<string | null>(null);
  const [validationEmail, setValidationEmail] = React.useState<string | null>(null);
  const [validationPassword, setValidationPassword] = React.useState<string | null>(null);

  const validateFields = () => {
    const validation = FormValidation(name, password, email);
  
    if (!validation[2]) {
      setValidationNombre("*El nombre contiene caracteres inválidos o no se ajusta a los requisitos.");
    }
    if (!validation[1]) {
      setValidationPassword("*La contraseña debe tener mínimo ocho caracteres, mayúsculas y un número.");
    }
    if (!validation[0]) {
      setValidationEmail("*El email no es correcto.");  
    }
    if (validation[0] && validation[1] && validation[2]) {
      sendRegisterRequest()
    }    

  };

  const handleInputClick = () => {
    setValidationEmail(null)
    setValidationNombre(null)
    setValidationPassword(null)
  }

  const sendRegisterRequest = useCallback(async () => {
    const formData = {
      email: email,
      password: password,
      nombre: name,
    };

    try {
      const response = await fetch(`${azure_backend}addUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseBody = await response.text();

        window.location.href = azure_frontend;
      } else {
        console.log(response);
        console.error("Fracaso en el registro");
      }
    } catch (error) {
      console.error("Error en la solicitud", error);
    }
  }, [email, password]);

  

  return (
    <div>
      <div className="container position-sticky z-index-sticky top-0">
        <div className="row">
          <div className="col-12"></div>
        </div>
      </div>
      <main className="main-content  mt-0">
        <section>
          <div className="page-header min-vh-100">
            <div className="container">
              <div className="row">
                <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">
                  <img
                    src={img}
                    height={799}
                    width={910}
                    className="position-relative h-100 m-3 px-1 border-radius-lg d-flex flex-column justify-content-center"
                    style={{ backgroundSize: "cover" }}
                  />
                </div>
                <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
                  <div className="card card-plain">
                    <div className="card-header bg-gray-200">
                      <h4 className="font-weight-bolder">Formulario de registro</h4>
                      <p className="mb-0">
                        Introduce tus datos para registrarte
                      </p>
                    </div>
                    <div className="card-body">
                      <form role="form">
                      <label className="form-label">
                           Nombre completo
                          </label>
                        <div className="input-group input-group-outline mb-3">
                        
                          <input
                            type="text"
                            onChange={(event) => setName(event?.target.value)}
                            onClick={handleInputClick}
                            id="name"
                            className="form-control"
                            autoComplete="off"
                          />
                        </div>
                        {validationNombre && (
                          <p className="text-success text-primary text-gradient font-weight-bold message-time" >
                            {validationNombre}
                          </p>
                        )}
                        <label className="form-label">
                           Email
                          </label>
                        <div className="input-group input-group-outline mb-3">
                          
                          <input
                            type="email"
                            onChange={(event) => setEmail(event?.target.value)}
                            onClick={handleInputClick}
                            id="email"
                            className="form-control"
                            autoComplete="off"
                          />
                        </div>
                        {validationEmail && (
                          <p className="text-success text-primary text-gradient font-weight-bold message-time"  >
                            {validationEmail}
                          </p>
                        )}
                        <label className="form-label">
                           Contraseña
                          </label>
                        <div className="input-group input-group-outline  mb-3">
          
                          <input
                            type="password"
                            onChange={(event) =>
                              setPassword(event?.target.value)
                            }
                            onClick={handleInputClick}
                            id="password"
                            className="form-control"
                            autoComplete="off"
                          />
                        </div>
                        {validationPassword && (
                          <p className="text-success text-primary text-gradient font-weight-bold message-time" >
                            {validationPassword}
                          </p>
                        )}
                        <div className="form-check form-check-info text-start ps-0">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            value=""
                            id="flexCheckDefault"
                            checked
                          />
                          <label
                            className="form-check-label"
                            htmlFor="flexCheckDefault"
                          >
                            Estoy de acuerdo con los{" "}
                            <a
                              href="javascript:;"
                              className="text-dark font-weight-bolder"
                            >
                              Términos y Condiciones
                            </a>
                          </label>
                        </div>
                        <div className="text-center">
                          <button
                            type="button"
                            onClick={() => validateFields()}
                            className="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0"
                          >
                            Registrarse
                          </button>
                        </div>
                      </form>
                    </div>
                    <div className="card-footer text-center pt-0 px-lg-2 px-1">
                      <p className="mb-2 text-sm mx-auto">
                        ¿Ya tienes cuenta?{" "}
                        <a
                          href="/login"
                          className="text-primary text-gradient font-weight-bold"
                        >
                          Inicia sesión
                        </a>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
