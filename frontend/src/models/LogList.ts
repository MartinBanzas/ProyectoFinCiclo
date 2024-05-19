class LogList {
    id: number;
    user_id: number;
    day: Date;
    inicio_sesion: string;
    fin_sesion?: string;
    sesion_ok: boolean;

    constructor(id: number, user_id: number, day: Date, inicio_sesion: string, fin_sesion?: string, sesion_ok: boolean = false) {
        this.id = id;
        this.user_id = user_id;
        this.day = day;
        this.inicio_sesion = inicio_sesion;
        this.fin_sesion = fin_sesion;
        this.sesion_ok = sesion_ok;
    }
}

export default LogList;