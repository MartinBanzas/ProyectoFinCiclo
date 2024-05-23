import sadFace from '../../assets/img/sadface.svg';

export const Error = () => {


    return (
        <div className="container text-center">
        <h1 className="display-6">403. O 404. La página a la que quieres acceder no existe, o no tienes permisos para acceder.</h1>
        <img src={sadFace}></img>
        </div>
    )
}