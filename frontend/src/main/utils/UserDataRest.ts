import UserModel from "../../models/UserModel";


export const get_all_users = async () => {
    const baseUrl: string = "http://localhost:5000/get_users";
    const bioDefault="Este es un espacio en el que nos cuentes un poco acerca de ti mismo. No seas tímido y permite que tus compañeros te conozcan";

    try {
        const response = await fetch(baseUrl);
        
        const responseJson = await response.json()

        if (!response.ok) {
            throw new Error('Algo ha ido mal');
        }

        
        const responseData = responseJson;
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

