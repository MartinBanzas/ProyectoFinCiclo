import styled from 'styled-components';

type Props = {
  gameOver?: boolean;
};

export const StyledDisplay = styled.div<Props>`
  box-sizing: border-box;
  display: flex;
  align-items: space-between;
  margin: 0 0 20px 0;
  padding: 20px;
  border: 2px solid;
  min-height: 20px;
  width: 120px;
  border-radius: 10px;
  color: ${props => (props.gameOver ? 'white' : 'white')};
  background: #e91e63;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 0.8rem;
`;