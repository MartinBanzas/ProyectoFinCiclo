import React from "react";
import { StyledStartButton } from "./StartButton.styles";

type Props = {
    callback: () => void;
}

const StartButton: React.FC<Props> = ({callback}) => (
    <StyledStartButton onClick={callback}>Iniciar</StyledStartButton>
)

export default StartButton;