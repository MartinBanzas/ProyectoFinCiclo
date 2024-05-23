import css from ".../../../../assets/icons/css.png";
import pdf from "../../../../assets/icons/pdf.png";
import java from "../../../../assets/icons/java.png";
import gif from "../../../../assets/icons/gif.png";
import html from "../../../../assets/icons/html.png"
import odf from "../../../../assets/icons/odf.png";
import doc from "../../../../assets/icons/doc.png";
import jpg from "../../../../assets/icons/jpg.png";
import png from "../../../../assets/icons/png.png";
import zip from "../../../../assets/icons/zip.png";
import sql from "../../../../assets/icons/sql.png";
import txt from "../../../../assets/icons/txt.png";
import cpp from "../../../../assets/icons/cpp.png"
import js from "../../../../assets/icons/js.png"
import mp3 from "../../../../assets/icons/mp3.png"
import ImgDefault from "../../../../assets/icons/_blank.png"





export const formatFecha = (fechaStr: string) => {
    const fecha = new Date(fechaStr);
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    const hour = String(fecha.getHours()).padStart(2, "0");
    const minute = String(fecha.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day} ${hour}:${minute}`;
};

export const formatSize = (size: number) => {
    const mb = (size / (1024 * 1024)).toFixed(2);

    if (Number(mb) >= 1) {
        return mb + " MB";
    } else {
        return (size / 1024).toFixed(2) + " kB";
    }
}

export const getImg = (tipo: string) => {

  //  console.log(tipo);
    switch (tipo) {

        
        case "text/plain":
        case "Optional[txt]": return txt; 

        case "application/vnd.oasis.opendocument.text": return odf; 
        case "application/pdf": return pdf; 
        case "image/jpeg": return jpg; 
        case "image/jpg": return jpg; 
        case "image/png": return png; 
        case "application/msword": return doc;
        case "audio/mpeg": return mp3;
        case "text/javascript":
        case "application/json": return js; 

        case "application/x-zip-compressed":
        case "application/x-7z-compressed":
        case "application/x-rar-compressed":
        return zip;

        case "text/html": return html; 

        default: return ImgDefault; 


    }
}

