import { getNombre } from "../../../Login/TokenHandler";
import UserModel from "../../../../../models/UserModel";

const nombre = getNombre;

const compareScore = (score: number, playerList: UserModel[]) => {
  for (const player of playerList) {
    console.log(nombre);
    console.log(player.puntuacion, player.nombre);
    if (score > player.puntuacion && nombre === player.nombre) {
      return true;
    }
  }
  return false;
};




export const handleNewMaximumScore = (score: number, playerList: UserModel[]) => {

  
  if (compareScore(score, playerList)) {
    const apiUrl = 'http://localhost:5000/tetris/highScore';  // Reemplaza con la URL de tu recurso específico
    const newData = {
      nombre: nombre,
      puntuacion: score
    }
    fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newData),
    })
      .then(async response => {
        if (response.ok) {
          console.log('Recurso actualizado correctamente');
        } else {
          console.log('Algo ha ido mal al actualizar la puntuación');
        }

      })
  }

}