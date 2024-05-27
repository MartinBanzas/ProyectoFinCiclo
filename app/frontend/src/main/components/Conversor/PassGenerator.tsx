import { useState, useEffect } from "react";
import autorenew from "../../../assets/icons/autorenew.svg";
import copy from "../../../assets/icons/content_copy.svg";

export const PassGenerator = () => {
  const [password, setPassword] = useState("");
  const [passwordSize, setPasswordSize] = useState(8);
  const [mayus, setMayus] = useState(false);
  const [minus, setMinus] = useState(false);
  const [nums, setNums] = useState(false);
  const [symbols, setSymbols] = useState(false);

  useEffect(() => {
    handleNewPassword();
  }, [passwordSize, mayus, minus, nums, symbols]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(password)
      .then(() => {
        showMessage("Copiado al portapapeles");
      })
      .catch((err) => {
        console.error("Error al copiar al portapapeles: ", err);
      });
  };

  const handleNewPassword = () => {
    let characters = "";
    if (mayus) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (minus) characters += "abcdefghijklmnopqrstuvwxyz";
    if (nums) characters += "0123456789";
    if (symbols) characters += "!@#$%^&*()_+-=[]{}|;:'\",.<>?/";

    if (characters === "") {
      characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }

    let newPassword = "";
    for (let i = 0; i < passwordSize; i++) {
      newPassword += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    setPassword(newPassword);
  };

  const showMessage = (message: string | null) => {
    const messageElement = document.getElementById("message");

    if (messageElement) {
      messageElement.textContent = message;
      messageElement?.classList.add("show");

      setTimeout(() => {
        messageElement.classList.remove("show");
      }, 2000); 
    }
  };
  return (
    <div>
  
      <div className="card w-100" style={{ height: "120px" }}>
      <div id="message" className="ms-9 mt-2 message"/>
        <div className="card-body">
          <p>{password}</p>
          <button
            className="btn btn-primary btn-sm"
            onClick={handleNewPassword}
          >
            <img src={autorenew} alt="Regenerar" />
          </button>
          <button
            className="ms-2 btn btn-secondary btn-sm"
            onClick={handleCopy}
          >
            <img src={copy} alt="Copiar" />
          </button>
         
        </div>
        
      </div>
      <div className="mt-4 card">
        <div className="card-body">
          <input
            type="number"
            value={passwordSize}
            onChange={(event) => setPasswordSize(Number(event.target.value))}
            min={1}
            max={50}
          />
          <input
            className="mt-2 form-range"
            type="range"
            value={passwordSize}
            onChange={(event) => setPasswordSize(Number(event.target.value))}
            min={1}
            max={50}
          />

          <div className="mt-2">
            <p className="h4">Personaliza tu contraseña</p>
            <input
              type="checkbox"
              checked={mayus}
              onChange={() => setMayus(!mayus)}
              name="Mayúsculas"
              id="Mayúsculas"
            />
            <label className="ms-1" htmlFor="Mayúsculas">
              Mayúsculas
            </label>

            <input
              className="ms-2"
              type="checkbox"
              checked={minus}
              onChange={() => setMinus(!minus)}
              name="Minúsculas"
              id="Minúsculas"
            />
            <label className="ms-1" htmlFor="Minúsculas">
              Minúsculas
            </label>

            <input
              className="ms-2"
              type="checkbox"
              checked={nums}
              onChange={() => setNums(!nums)}
              name="Números"
              id="Números"
            />
            <label className="ms-1" htmlFor="Números">
              Números
            </label>

            <input
              className="ms-2"
              type="checkbox"
              checked={symbols}
              onChange={() => setSymbols(!symbols)}
              name="Símbolos"
              id="Símbolos"
            />
            <label className="ms-1" htmlFor="Símbolos">
              Símbolos
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
