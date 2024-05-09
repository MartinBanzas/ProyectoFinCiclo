

import React, { useCallback } from 'react';
import img from '../../../assets/img/illustrations/illustration-signup.jpg'
import { FormValidation } from './FormValidation';
export const Register = () => {
  // // style="background-image: url('../assets/img/illustrations/illustration-signup.jpg'); background-size: cover;">

  const [username, setUsername]=React.useState("");
  const [labelLogin, setLabelLogin]=React.useState('Nombre de inicio de sesión');
  const [labelName, setLabelName] = React.useState("Nombre completo");
  const [name, setName] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [labelPassword, setLabelPassword] = React.useState("Contraseña");
  const [email, setEmail] = React.useState("");
  const [labelEmail, setLabelEmail] = React.useState("Email");
  const [validationError, setValidationError] = React.useState<string | null>(null);


  const validateFields =() => {

    if (FormValidation(name, password, email)) {
      sendRegisterRequest()
    }
    else {
      setValidationError("*Por favor, ajústate al formato. Min 8 caracteres para la contraseña, y debe tener caracteres que no sean letras");
      console.log('No valido');
    }
  }

  const handleLabelClick = (event: any) => {

    switch (event.target.id) {
      case "password": setLabelPassword(""); break;
      case "email": setLabelEmail(""); break;
      case "name": setLabelName(""); break;
      case "username": setLabelLogin(""); break;
    }
  }

  const sendRegisterRequest = useCallback(async () => {
    const formData = {
      email: email,
      password: password,
      nombre: name,
    };

    try {
      const response = await fetch("http://localhost:5000/addUser", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const responseBody = await response.text();

        window.location.href = "http://localhost:3000";
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
          <div className="col-12">
          </div>
        </div>
      </div>
      <main className="main-content  mt-0">
        <section>
          <div className="page-header min-vh-100">
            <div className="container">
              <div className="row">
                <div className="col-6 d-lg-flex d-none h-100 my-auto pe-0 position-absolute top-0 start-0 text-center justify-content-center flex-column">

                  <img src={img} className='position-relative h-100 m-3 px-1 border-radius-lg d-flex flex-column justify-content-center' style={{ backgroundSize: 'cover' }} />

                </div>
                <div className="col-xl-4 col-lg-5 col-md-7 d-flex flex-column ms-auto me-auto ms-lg-auto me-lg-5">
                  <div className="card card-plain">
                    <div className="card-header bg-gray-200">
                      <h4 className="font-weight-bolder">Iniciar sesión</h4>
                      <p className="mb-0">Introduce tus datos para registrarte</p>
                    </div>
                    <div className="card-body">
                      <form role="form">
                      <div className="input-group input-group-outline mb-3">
                          <label className="form-label">{name ? "" : labelName} </label>
                          <input type="text" onChange={(event) => setName(event?.target.value)} onClick={handleLabelClick} id="name" className="form-control" autoComplete='off' />
                        </div>
                        <div className="input-group input-group-outline mb-3">
                          <label className="form-label">{email ? "" : labelEmail} </label>
                          <input type="email" onChange={(event) => setEmail(event?.target.value)} onClick={handleLabelClick} id="email" className="form-control" autoComplete='off' />
                        </div>
                        <div className="input-group input-group-outline mb-3">
                          <label className="form-label">{password ? "": labelPassword}</label>
                          <input type="password" onChange={(event) => setPassword(event?.target.value)} onClick={handleLabelClick} id="password" className="form-control" autoComplete='off'/>
                        </div>
                       
                        <div className="form-check form-check-info text-start ps-0">
                          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" checked />
                          <label className="form-check-label" htmlFor="flexCheckDefault">
                            Estoy de acuerdo con los <a href="javascript:;" className="text-dark font-weight-bolder">Términos y Condiciones</a>
                          </label>
                        </div>
                        <div className="text-center">
                          <button type="button" onClick={()=>validateFields()} className="btn btn-lg bg-gradient-primary btn-lg w-100 mt-4 mb-0">Registrarse</button>
                        </div>
                      </form>
                    </div>
                    <div className="card-footer text-center pt-0 px-lg-2 px-1">
                      <p className="mb-2 text-sm mx-auto">
                        ¿Ya tienes cuenta? <a href="/login" className="text-primary text-gradient font-weight-bold">Inicia sesión</a>
                      </p>
                      {validationError && <p className="text-danger text-primary text-gradient font-weight-bold">{validationError}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>)
}