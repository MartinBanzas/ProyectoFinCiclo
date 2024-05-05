
import React, { useCallback } from 'react'
import logo from '../../assets/img/logo-ct.png'
import bg from '../../../assets/img/login-bg.jpg'

export const Login = () => {

    const [email, setEmail] = React.useState("");
    const [labelEmail, setLabelEmail] = React.useState("Email");
    const [password, setPassword] = React.useState("");
    const [labelPassword, setLabelPassword] = React.useState("Contraseña");

    const handleLabelClick = (event: any) => {
        switch (event.target.id) {
            case "password": setLabelPassword(""); break;
            case "email": setLabelEmail(""); break;
        }
    }

    const sendLoginRequest = useCallback(async (event: any) => {
        const formData = {
            username: email,
            password: password
        };

        try {
            const response = await fetch("http://localhost:8080/auth/loginUser", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const responseBody = await response.text();
                localStorage.setItem('token', responseBody);
                window.location.href = "http://localhost:3000/home";
            } else {

                console.log(response);
                console.error("Fracaso en el logeo");
            }
        } catch (error) {
            console.error("Error en la solicitud", error);
        }
    }, [email, password]);

    return (  
        <div style={{ backgroundImage: `url(${bg})` }}>
            <main className="main-content  mt-0">
                <div className="page-header align-items-start min-vh-100" >
                    <span className="mask bg-gradient-dark opacity-6"></span>
                    <div className="container my-auto">
                        <div className="row">
                            <div className="col-lg-4 col-md-8 col-12 mx-auto">
                                <div className="card z-index-0 fadeIn3 fadeInBottom">
                                    <div className="card-header p-0 position-relative mt-n4 mx-3 z-index-2">
                                        <div className="bg-gradient-primary shadow-primary border-radius-lg py-3 pe-1">
                                            <h4 className="text-white font-weight-bolder text-center mt-2 mb-0">Iniciar sesión</h4>
                                            <div className="row mt-3">
                                                <div className="col-2 text-center ms-auto">
                                                    <a className="btn btn-link px-3" href="javascript:;">
                                                        <i className="fa fa-facebook text-white text-lg"></i>
                                                    </a>
                                                </div>
                                                <div className="col-2 text-center px-1">
                                                    <a className="btn btn-link px-3" href="javascript:;">
                                                        <i className="fa fa-github text-white text-lg"></i>
                                                    </a>
                                                </div>
                                                <div className="col-2 text-center me-auto">
                                                    <a className="btn btn-link px-3" href="javascript:;">
                                                        <i className="fa fa-google text-white text-lg"></i>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <form role="form" className="text-start">
                                            <div className="input-group input-group-outline my-3">
                                                <label htmlFor='text' className="form-label">{email ? "" : labelEmail}</label>
                                                <input type="email" onChange={(event) => setEmail(event.target.value)} onClick={handleLabelClick} id='email' className="form-control" />
                                            </div>
                                            <div className="input-group input-group-outline mb-3">
                                                <label className="form-label">{password ? "" : labelPassword}</label>
                                                <input type="password" onChange={(event) => setPassword(event?.target.value)} onClick={handleLabelClick} className="form-control" id='password' />
                                            </div>
                                            <div className="form-check form-switch d-flex align-items-center mb-3">
                                                <input className="form-check-input" type="checkbox" id="rememberMe" />
                                                <label className="form-check-label mb-0 ms-3" htmlFor="rememberMe">Recuérdame</label>
                                            </div>
                                            <div className="text-center">
                                                <button type="button" onClick={sendLoginRequest} className="btn bg-gradient-primary w-100 my-4 mb-2">Entrar</button>
                                            </div>
                                            <p className="mt-4 text-sm text-center">
                                                ¿No tienes cuenta? <a href="/register" className="text-primary text-gradient font-weight-bold">Regístrate</a>
                                            </p>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}