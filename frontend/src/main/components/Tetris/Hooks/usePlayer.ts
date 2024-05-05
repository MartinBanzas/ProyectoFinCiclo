import { STAGE_WIDTH } from "../Setup";
import { isColliding, randomTetromino } from "../GameHelper";
import React from "react";
import { STAGE } from "./useStage";

export type PLAYER = {
    pos: {x:number, y:number};
    tetromino: (string | number) [][];
    collided: boolean;
}

export const usePlayer = () => {


    const [player, setPlayer] = React.useState({} as PLAYER);
    const updatePlayerPos = ({x, y, collided}: {x:number, y:number, collided:boolean}): void => {
        setPlayer(prev=> ({...prev, 
        pos: {x: (prev.pos.x+=x), y: (prev.pos.y+y)},
        collided: collided
    
    }))
    };

    const rotate = (matrix:PLAYER['tetromino']) => {
      //Hacer que las filas se conviertan en columnas (transpuesta)
      
      const mtrx = matrix.map((_, i) => matrix.map(column=>column[i]));
    return mtrx.map(row=>row.reverse());
    }

    const playerRotate = (stage:STAGE):void => {
        const clonedPlayer = JSON.parse(JSON.stringify(player))
        clonedPlayer.tetromino=rotate(clonedPlayer.tetromino)

        const posX = clonedPlayer.pos.x;
        let offset = 1;

        //Se ocupa de que no se pueda rotar sobre paredes o en tetrominos apilados.
        while (isColliding(clonedPlayer, stage, {x:0, y:0})) {
            clonedPlayer.pos.x+=offset;
            offset = -(offset+(offset>0 ? 1: -1 ));

            if (offset > clonedPlayer.tetromino[0].length) {
                clonedPlayer.pos.x=posX;
                return;
            }
        }

        setPlayer(clonedPlayer);
    }

    const resetPlayer = React.useCallback(
        (): void =>
        setPlayer({
            pos: {x:STAGE_WIDTH / 2-2, y:0},
            tetromino: randomTetromino().shape,
             collided: false
        }),
        []
    );
return {player, updatePlayerPos, resetPlayer, playerRotate};
}