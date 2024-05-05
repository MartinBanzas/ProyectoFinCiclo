import React from "react";
import { StyledCell } from "./Cell.styles";
import { TETROMINOS } from "../../Setup";

type Props = {
    type: keyof typeof TETROMINOS;
}

const Cell: React.FC<Props> = ({type}) => <StyledCell type={type} color={TETROMINOS[type].color}/>

export default React.memo(Cell);
//Con memo solo re-renderiza lo que cambia.