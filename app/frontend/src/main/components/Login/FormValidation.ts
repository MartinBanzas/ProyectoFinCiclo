const emailRegex = /^[\w\-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])[a-zA-Z0-9]{8,}$/;
const nombreRegex = /^[a-zA-Z\s]+$/;

export const FormValidation = (nombre:string, password:string, email:string) => {
    return ([emailRegex.test(email), passwordRegex.test(password),nombreRegex.test(nombre)]);
};