import { Fab } from "@mui/material";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Delete } from "@mui/icons-material";
import Canvas from "../Canvas/Canvas";
import { FabContainer, GameContainer } from "./Game.styles";
import { useGameContext } from "../../contexts/GameContext";

function Game() {
  const { socket, player } = useGameContext();

  return !!player && (
    <GameContainer>
      <FabContainer>
        <Fab color="primary" onClick={() => socket.emit("clear")}>
          <Delete />
        </Fab>
      </FabContainer>

      <Canvas />
    </GameContainer>
  );
}

export default Game;
