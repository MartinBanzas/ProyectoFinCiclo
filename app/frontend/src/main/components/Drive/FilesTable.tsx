import React, { useEffect, useState, useCallback } from "react";
import FileModel from "../../../models/FicheroModel";
import { formatFecha, formatSize, getImg } from "./utils/Utils";
import { FileRejection, useDropzone } from "react-dropzone";
import { ContextMenu } from "./ContextMenu";
import { azure_backend } from "../../urls";

export const FilesTable = () => {
  const [ficheros, setFicheros] = useState<FileModel[]>([]);
  const [httpError, setHttpError] = useState(null);
  const [newUpload, setNewUpload] = useState(false);
  const [isContextMenuVisible, setIsContextMenuVisible] = useState(false);
  const items = [
    "Eliminar",
    "Renombrar",
    "Por fecha",
    "Por nombre",
    "Por tamaño",
  ];
  const [selectedRightClickFile, setSelectedRightClickFile] = useState("");
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });
  const [filesUpdated, setFilesUpdated] = useState(false);

  //Ordena archivos por fecha
  const sortByDate = () => {
    const sortedFicheros = [...ficheros];
    sortedFicheros.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime();
    });
    setFicheros(sortedFicheros);
  };

  //Ordena archivos por tamaño
  const sortBySize = () => {
    const sortedFicheros = [...ficheros];
    sortedFicheros.sort((a, b) => {
      console.log(a.size, b.size);
      return Number(b.size) - Number(a.size);
    });
    setFicheros(sortedFicheros);
  };
  
//Ordena archivos por nombre
  const sortByName = () => {
    const sortedFicheros = [...ficheros];
    sortedFicheros.sort((a, b) => {
      return a.path.localeCompare(b.path);
    });

    setFicheros(sortedFicheros);
  };

  const handleFilesUpdated = () => {
    setFilesUpdated(true);
  };

  const handleRightClick = (e: any, id: any) => {
    e.preventDefault();
    setSelectedRightClickFile(id);
    setIsContextMenuVisible(true);
    const coords = { x: e.clientX, y: e.clientY };
    setCoordinates(coords);
  };

  const hideContextMenu = () => {
    setIsContextMenuVisible(false);
  };

  const onDrop = useCallback(
    async (
      acceptedFiles: File[],
     
    ) => {
      const file = new FileReader();
      file.readAsDataURL(acceptedFiles[0]);
      const formData = new FormData();
      formData.append("file", acceptedFiles[0]);

      try {
      
        const response = await fetch(`${azure_backend}drive/new/upload`, {
          headers: {
            'Access-Control-Allow-Origin':'*'
          },
          method: "POST",
          body: formData,
        });
        if (response.ok) {
          console.log(response);
          console.log("File uploaded successfully");
          setNewUpload(true);
          initialFilesFetch();
        } else {
          console.error("Failed to upload file");
        }
      } catch (error) {
        console.error("Error uploading file", error);
      }
      setNewUpload(true);
    },
    []
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true,
  });

  //Fetch data for the file table
  const initialFilesFetch = useCallback(async () => {
    const baseUrl: string = `${azure_backend}drive/files`;
    const url: string = `${baseUrl}`;

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("Algo ha ido mal");
      }

      const responseJson = await response.json();
      const loadedFiles: FileModel[] = [];

      for (const key in responseJson) {
        loadedFiles.push({
          id: responseJson[key].id,
          description: responseJson[key].description,
          path: responseJson[key].path,
          type: getImg(responseJson[key].type),
          size: responseJson[key].size,
          date: formatFecha(responseJson[key].date),
        });
      }
      setFilesUpdated(false);
      setFicheros(loadedFiles);
    } catch (error) {}
  }, [filesUpdated == true]);
  //Controlamos desde este componente si se han actualizado
  //los ficheros en el componente hijo al hacer borrados/renombrados
  //en caso positivo se establece desde allí como true el booleano pasado como props
  //se actualiza el estado y desde la api se coge la nueva lista, renderizando de nuevo

  //Initial load of data with fetchFicheros
  useEffect(() => {
    initialFilesFetch();
  }, [initialFilesFetch]);

  if (httpError) {
    return (
      <div className="container m-5">
        <p>{httpError}</p>
      </div>
    );
  }
  const ficherosDestacados = ficheros.slice(-3);
  //Base url for downloads
  const baseUrl = `${azure_backend}drive`;

  return (
    <div className="container-md text-center bg-white mt-6 rounded">
      <div className="container-sm">
        <div className="mt-2 card-header p-0 position-relative mt-n4 mx-3 z-index-2">
          <div className="bg-gradient-primary shadow-primary border-radius-lg pt-4 pb-3">
            <h6 className="text-white text-capitalize ps-3">Tus ficheros</h6>
          </div>
        </div>

        <div className="row">
          {ficherosDestacados.map((file, index) => (
            <div key={index} className="col-md-4 mb-4 ">
              <div className="card mw-20 mt-3 h-100  ">
                <div className="row g-0">
                  <div className="col-md-4">
                    <a
                      className="card-title"
                      href={`${baseUrl}/get/${file.id}`}
                      download={file.path}
                    >
                      <img
                        src={file.type}
                        height={96}
                        width={96}
                        className="img-fluid rounded-start mt-4"
                        alt="..."
                      />
                    </a>
                  </div>
                  <div className="col-md-8">
                    <div className="card-body">
                      <a
                        className="card-title"
                        href={`${baseUrl}/get/${file.id}`}
                        download={file.path}
                      >
                        <h5 className="card-title">{file.path}</h5>
                      </a>
                      <p className="card-text">{file.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        {...getRootProps()}
        className="table-responsive bg-white"
        style={{ overflowY: "auto", maxHeight: "550px" }}
      >
        <input {...getInputProps()} />
        <table className="table table-striped rounded align-items-center">
          <thead>
            <tr>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Nombre
              </th>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Descripción
              </th>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Tipo
              </th>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Tamaño
              </th>
              <th
                scope="col"
                className="text-uppercase text-secondary text-xxs font-weight-bolder opacity-7"
              >
                Fecha de modificación
              </th>
            </tr>
          </thead>
          <tbody>
            {ficheros.map((file) => (
              <tr key={file.id}>
                <td>
                  <a
                    href={`${baseUrl}/get/${file.id}`}
                    defaultValue={file.id}
                    onContextMenu={(e) => handleRightClick(e, file.id)}
                    download={file.path}
                  >
                    {file.path}
                  </a>
                </td>
                <td>{file.description}</td>
                <td>
                  <img src={file.type} height="28px" width="28px" alt="icono" />
                </td>
                <td>{formatSize(Number(file.size))}</td>
                <td>{file.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isContextMenuVisible && (
        <ContextMenu
          sortBySize={sortBySize}
          sortByDate={sortByDate}
          sortByName={sortByName}
          hideContextMenu={hideContextMenu}
          handleFilesUpdated={handleFilesUpdated}
          items={items}
          coordinates={coordinates}
          id={selectedRightClickFile}
        />
      )}
    </div>
  );
};
