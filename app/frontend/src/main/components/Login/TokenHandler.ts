const TokenHandler = () => {
    const tokenLocalStorage = localStorage.getItem('token');

    if (!tokenLocalStorage) {
        // Manejar el caso donde el token no está presente
        console.error("Token no encontrado en el almacenamiento local.");
        return { valid: false, nombre: null };
    }

    const [headerBase64, payloadBase64, signatureBase64] = tokenLocalStorage.split(".");

  
    const payloadJson = atob(payloadBase64);
    const payload = JSON.parse(payloadJson);

 
    //Fecha caducidad
    const expirationTimestamp = payload.exp;

    //username, roles e id
    const roles=payload.roles;
    const nombre = payload.nombre;
    const userId=payload.id;

    return { valid: expirationTimestamp > Date.now(), nombre: nombre, roles:roles, userId:userId };
}

export const { valid: isTokenValid, nombre: getNombre, roles:roles, userId:userId } = TokenHandler();