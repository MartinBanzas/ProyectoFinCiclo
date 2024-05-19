import { roles } from "../Login/TokenHandler"
import { AdminView } from "./AdminView"
import { StandardView } from "./StandardView"

const admin = () => {
    return (
        <AdminView/>
    )
}

const standard = () => {
    return (
        <StandardView/>
    )
}

const LoginListMain = () => {
   return roles == "ROLE_ADMIN" ? admin() : standard()
}

export default LoginListMain;