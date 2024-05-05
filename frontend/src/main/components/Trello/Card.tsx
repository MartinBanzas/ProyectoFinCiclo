import React, { useState } from "react";

type DeleteCardFunction = (idCard:String) => void;
type EditCardFunction = (idCard:String, newText:String) => void;

interface CardProps {
  idCard: string;
  text: string;
  deleteCard: DeleteCardFunction;
  editCard:EditCardFunction;
}

export const Card: React.FC<CardProps> = (props) => {

    const [isHovered, setIsHovered] = useState(false);
    const [isEditing, setEditing] = useState(false);
    const [newText, setNewText] = useState(props.text);

    const handleEditClick = () => {
        setEditing(true);
      };
    
      const handleCancelClick = () => {
        setEditing(false);
        setNewText(props.text);
      };
    
      const handleMouseEnter = () => {
        setIsHovered(true);
      };
    
      const handleMouseLeave = () => {
        setIsHovered(false);
      };
    
      const handleSaveClick = (event: { preventDefault: () => void; }) => {
        event.preventDefault()
        props.editCard(props.idCard, newText);
        setEditing(false);
      };
    
      const handleDelete = () => {
        props.deleteCard(props.idCard);
      };
    
      const handleNameChange = (e: { target: { value: any; }; }) => {
        setNewText(e.target.value);
      };

     
      const viewTemplate = (
        <div className="card bg-light shadow">
          <div
            className="container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-body" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p className="card-text text-break">{props.text}</p>
              {isHovered && (
                <div>
                  <button className="btn btn-success btn-sm px2" onDoubleClick={handleEditClick}>
                    Edit
                  </button>
                  <button className="btn btn-primary btn-sm px-2 ms-1" onDoubleClick={() => handleDelete()}>
                    X
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      );

      const editingTemplate = (
        <div className="d-flex align-items-center">
          <form>
            <input
              type="text"
              value={newText}
              onChange={handleNameChange}
              className="form-control bg-gray-200 mb-2"
            />
            <button className="btn btn-primary ms-2 btn-sm px-2" onClick={handleSaveClick}>
              Guardar
            </button>
            <button className="btn btn-secondary ms-1 btn-sm px-2" onClick={handleCancelClick}>
              Cancelar
            </button>
          </form>
        </div>
      );


    return (<div>
         {isEditing ? editingTemplate : viewTemplate} 
    </div>);
}