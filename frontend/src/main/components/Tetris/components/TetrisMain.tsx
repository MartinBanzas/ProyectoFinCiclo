import React, { useEffect } from "react";
import Stage from "./Stage/Stage";
import Display from "./Display/Display";
import StartButton from "./StartButton/StartButton";
import { StyledTetris, StyledTetrisWrapper } from "./Main.styles";
import { createStage, isColliding } from "../GameHelper";
import { useInterval } from "../Hooks/useInterval";
import { useStage } from "../Hooks/useStage";
import { usePlayer } from "../Hooks/usePlayer";
import { useGameStatus } from "../Hooks/useGameStatus";
import { Music } from "../Music";
import { Leaderboard } from "./Leaderboard/Leaderboard";
import { useState } from "react";
import { fetchResults } from "../../../utils/UserDataRest";
import UserModel from "../../../../models/UserModel";
import { handleNewMaximumScore } from "./Leaderboard/NewMaximumScore";

export const Main: React.FC = () => {

//Hay que controlar la ejecución de la música con un booleano que cambia con el re-render
//o dará el fallo de reproducción no autorizada de html.
  const [music, setMusic] = React.useState(false);
  const [musicOver, setMusicOver] = React.useState(false);
  const [dropTime, setDroptime] = React.useState<null | number>(null);
  const [gameOver, setGameOver] = React.useState(true);
  const [levelMusic, setLevelMusic]=React.useState(0);
  const gameArea = React.useRef<HTMLDivElement>(null);
  const [open, setOpen] = React.useState(false);

  const { player, updatePlayerPos, resetPlayer, playerRotate } = usePlayer();
  const { stage, setStage, rowsCleared } = useStage(player, resetPlayer);
  const { score, setScore, rows, setRows, level, setLevel } = useGameStatus(rowsCleared);
  const [playerList, setPlayerList] = useState<UserModel[]>([]);


  useEffect(() => {
    const fetchData = async () => {
        const result = await fetchResults();
        setPlayerList(result);
    };

    fetchData();
}, []); 


  const handleClose = () =>{setOpen(false)}
  const movePlayer = (dir: number) => {
    if (!isColliding(player, stage, { x: dir, y: 0 })) {
      updatePlayerPos({ x: dir, y: 0, collided: false });
    }
  };

  const keyUp = ({ keyCode }: { keyCode: number }): void => {
    if (!gameOver) {
      // Change the droptime speed when user releases down arrow
      if (keyCode === 40) {
        setDroptime(1000 / level + 200);
      }
    }
  };

  const handleStartGame = (): void => {
    // Need to focus the window with the key events on start
    if (gameArea.current) gameArea.current.focus();
    // Reset everything
    setStage(createStage());
    setDroptime(1000);
    resetPlayer();
    setScore(0);
    setLevel(1);
    setRows(0);
    setGameOver(false);
    setMusicOver(false);
    setMusic(true);
  };



  const move = ({ keyCode, repeat }: { keyCode: number; repeat: boolean }): void => {
    if (!gameOver) {
      if (keyCode === 37) {
        movePlayer(-1);
      } else if (keyCode === 39) {
        movePlayer(1);
      } else if (keyCode === 40) {
        // Just call once
        if (repeat) return;
        setDroptime(30);
      } else if (keyCode === 82) {
        playerRotate(stage);
      }
    }
  };

  const drop = (): void => {
    // Increase level when player has cleared 10 rows
    if (rows > level * 10) {
      setLevel(prev => prev + 1);
     setLevelMusic(prev=>prev+1);
      setDroptime(1000 / level + 200);
    }


    if (!isColliding(player, stage, { x: 0, y: 1 })) {
      updatePlayerPos({ x: 0, y: 1, collided: false });
    } else {
      // Game over!
      if (player.pos.y < 1) {
        console.log('Game over!');
        setGameOver(true);
        handleNewMaximumScore(score, playerList);
        setDroptime(null);
        setMusicOver(true)
      }
      updatePlayerPos({ x: 0, y: 0, collided: true });
    }
  };

  useInterval(() => {
    drop();
  }, dropTime);
  
  return (
    <StyledTetrisWrapper role='button' tabIndex={0} onKeyDown={move} onKeyUp={keyUp} ref={gameArea}>
      <StyledTetris>
        <div className='display'>
          {gameOver ? (
            <>
              <Display gameOver={gameOver} text='Game Over!' />
              <StartButton callback={handleStartGame} />
            </>
          ) : (
            <>
              <Display text={`Score: ${score}`} />
              <Display text={`Rows: ${rows}`} />
              <Display text={`Level: ${level}`} />
            </>
          )}
        </div>
        
        <Stage stage={stage} />
        <button onClick={()=> setOpen(!open)} className="btn btn-primary mt-2">Ver las clasificaciones</button>
        <Leaderboard isOpen={open} handleClose={handleClose} playerList={playerList}/>
      </StyledTetris>
     
      {
        music ? (  
        <Music level={levelMusic} musicOver={musicOver} />) 
        : null
        }
     
    </StyledTetrisWrapper>
  );}
