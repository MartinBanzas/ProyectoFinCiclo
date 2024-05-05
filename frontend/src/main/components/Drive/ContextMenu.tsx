import React, { useRef, useEffect } from "react";
import { ModalRename } from "./utils/ModalRename";

export interface ContextMenuProps {
  id: string;
  items: string[];
  coordinates: { x: number; y: number };
  hideContextMenu: () => void;
  handleFilesUpdated: () => void;
  sortByName: () => void;
  sortByDate: () => void;
  sortBySize: () => void;
}

export const ContextMenu: React.FC<ContextMenuProps> = ({
  id,items,coordinates,hideContextMenu,handleFilesUpdated,sortByDate,sortByName,sortBySize,
}) => {
  const menuRef = useRef<HTMLUListElement>(null);
  const [showModalRename, setShowModalRename] = React.useState(false);
  const [newName, setNewName] = React.useState("");

  const handleFileDelete = async () => {
    const response = await fetch(`http://localhost:5000/drive/delete/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      hideContextMenu();
      handleFilesUpdated();
    }
  };

const handleFileRename = async () => {
  const response = await fetch(
    `http://localhost:5000/drive/rename/${id}?new_name=${encodeURIComponent(newName)}`,
    {
      method: "PATCH",
    }
  );
  if (response.ok) {
    console.log(response);
    hideContextMenu();
    handleFilesUpdated();
  }
};


  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      hideContextMenu();
    }

  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleEvent = (item: string) => {
    switch (item) {
      case "Eliminar":
        handleFileDelete();
        break;
      case "Renombrar":
        setShowModalRename(true);
        break;
      case "Por fecha":
        sortByDate();
        break;
      case "Por nombre":
        sortByName();
        break;
      case "Por tamaño":
        sortBySize();
        break;
    }
  };

  return (
    <ul
      ref={menuRef}
      className="ContextMenu"
      style={{ top: coordinates.y, left: coordinates.x }}
    >
      {items.map((item: string) => (
        <li key={item} className="" onClick={() => handleEvent(item)}>
          {item}
        </li>
      ))}
      <ModalRename
        handleFileRename={handleFileRename}
        setNewName={setNewName}
        setShowModalRename={setShowModalRename}
        showModalRename={showModalRename}
    
      />
    </ul>
  );
};
