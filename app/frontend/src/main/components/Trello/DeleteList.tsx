
export interface DeleteProps {
    idList:String;
    deleteList: (idList:String) => void;
}


export const DeleteListButton: React.FC<DeleteProps> = (props) => {

    const handleClick =() => {
        props.deleteList(props.idList);
        }

    return (

        <button onClick={handleClick} className="btn btn-success btn-sm">Borrar lista</button>

    );
}