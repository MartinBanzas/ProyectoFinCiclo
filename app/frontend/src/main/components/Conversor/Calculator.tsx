import { useState } from "react";
import "./css/calculator.css";
import { calcFactorial } from "./utils/Utils";

export const Calculator = () => {
  const [number, setNumber] = useState("");

  const handleResult = () => {
    try {
      const og = number;
      if (number.includes("^")) {
        const parts = number.split("^");
        const result = Math.pow(Number(parts[0]), Number(parts[1])).toString();
        setNumber(result);
      } else {
        const result = eval(number);
        result % 1 !== 0 ? setNumber(result.toFixed(3)) : setNumber(result);
      }
    } catch (error) {
      setNumber("Error");
    }
  };

  const handleButtonClick = (event: any) =>
    setNumber(number + event.target.value);

  const handleOtherOperations = (event: any) => {
    try {
      switch (event.target.value) {
        case "√":
          const sqrt = Math.sqrt(Number(number)).toFixed(2);
          setNumber(sqrt.toString());
          break;
        case "!":
          const factorial = calcFactorial(Number(number));
          factorial != undefined
            ? setNumber(factorial.toString())
            : setNumber("Error");
          break;
        case "³√":
          const cubic = Math.cbrt(Number(number)).toFixed(8);
          setNumber(cubic.toString());
          break;
        case "C":
          setNumber("");
          break;
        case "π":
          setNumber(number + "3.14");
          break;
        case "±":
          const negativeN = Number(number) * -1;
          setNumber(negativeN.toString());
          break;
        case "Oct":
          const oct = Number(number).toString(8);
          setNumber(oct.toString());
          break;
        case "Bin":
          const bin = Number(number).toString(2);
          setNumber(bin.toString());
          break;
        case "Hex":
          const hex = Number(number).toString(16);
          setNumber(hex.toString());
          break;
      }
    } catch (error) {
      setNumber("Error");
    }
  };

  return (
    <div className="card">
      <p className="display-2 bg-gradient-dark text-white text-end">
        {number === "" ? "0" : number}
      </p>
      <div className="card-body calculator-grid gap-1">
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="1"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="2"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="3"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="+"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="^"
        />

        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="4"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="5"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="6"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="-"
        />
        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="√"
        />

        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="7"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="8"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="9"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="*"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="%"
        />

        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="/"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="0"
        />
        <input
          type="button"
          onClick={handleButtonClick}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="."
        />
        <input
          type="button"
          onClick={handleResult}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="="
        />
        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="π"
        />

        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="!"
        />
        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="³√"
        />
        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="±"
        />
        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="Hex"
        />
        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark"
          value="Oct"
        />

        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc bg-gradient-dark "
          value="Bin"
        />
        <input
          type="button"
          onClick={handleOtherOperations}
          className="btn btn-primary btn-sm btn-calc"
          value="C"
        />
      </div>
    </div>
  );
};
