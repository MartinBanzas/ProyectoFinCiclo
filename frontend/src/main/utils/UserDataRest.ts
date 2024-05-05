import UserModel from "../../models/UserModel";


export const fetchResults = async () => {
    const baseUrl: string = "http://localhost:8080/api/users";
    const url: string = `${baseUrl}`;
    const bioDefault="Este es un espacio en el que nos cuentes un poco acerca de ti mismo. No seas tímido y permite que tus compañeros te conozcan";

    try {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Algo ha ido mal');
        }

        const responseJson = await response.json();
        const responseData = responseJson._embedded.users;
        const users: UserModel[] = [];

        for (const key in responseData) {
            users.push({
                id:responseData[key].id,
                nombre: responseData[key].nombre,
                puntuacion: responseData[key].puntuacion,
                bio: responseData[key].bio != null ? responseData[key].bio : bioDefault,
                email:responseData[key].email,
                facebook: responseData[key].facebook,
                twitter: responseData[key].twitter,
                movil: responseData[key].movil,
                instagram: responseData[key].instagram,
                avatar: responseData[key].avatar
            });
        }
       

        return users;
    } catch (error) {
      
        console.error('Error al obtener datos:', error);
        return [];
    }
};

