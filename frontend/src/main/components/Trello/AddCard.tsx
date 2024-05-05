import React, { useState } from "react";

export const AddCard = (props:any) => {

    const [Text, setText] = useState("");
    const [isAdding, setAdding] = useState(false);


    const handleChange = (e: { target: { value: React.SetStateAction<string>; }; }) => {
        setText(e.target.value);
      };
    
      const handleClick = () => {
        setAdding(!isAdding);
      }
    
      const cancelClick = () => {
        setAdding(false);
      }
    
      const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        props.addTask(Text);
        setText("");
        setAdding(false);
    
      };


      const newCard = (
        <div onSubmit={handleSubmit}>
          <form>
            <input
            className="mr-2"
              value={Text}
              onChange={handleChange}
            />
            <button type="submit" className=" ms-2 btn btn-primary btn-sm mt-2 px-2 ">
              ➕ Guardar
            </button>
            <button className="btn btn-secondary btn-sm px-2 mt-2 ms-1" onClick={cancelClick}>Cancelar</button>
    
          </form>
        </div>
      );

      const setAdd = (
        <div>
          <form>
            <button type="submit" onClick={handleClick} className="btn btn-primary btn-sm px-2 ">
              ➕ Nueva
            </button>
          </form>
        </div>
      );

    return isAdding ? newCard : setAdd;
}