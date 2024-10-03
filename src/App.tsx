import { useState } from 'react';
import { ChessGame, PieceColor } from './components/Chess/Game';
import ChessBoard from './components/ChessBoard/ChessBoard';

function App() {
  const [game] = useState(new ChessGame());
  const [squares, setSquares] = useState(game.getBoard());
  const currentTurn = game.getCurrentTurn();
  const [selectedPosition, setSelectedPosition] = useState<
    [number, number] | null
  >(null);


  const handleSquareClick = (
    row: number,
    col: number,
    color: PieceColor | undefined
  ) => {
    if (color === currentTurn || selectedPosition) {
      if (selectedPosition) {
        const [fromRow, fromCol] = selectedPosition;
        const moved = game.movePiece(fromRow, fromCol, row, col);
        if (moved) {
          setSquares(game.getBoard());
        }
        setSelectedPosition(null);
      } else {
        setSelectedPosition([row, col]);
      }
    } else {
      if (selectedPosition) {
        setSelectedPosition(null);
      }
    }
  };

  return (
    <div className='justify-center'>
      {/* <AgentComparator /> */}
      <h1>Juego de Ajedrez Inteligente</h1>

      <h2>Turno actual: {currentTurn === 'white' ? 'Blanco' : 'Negro'}</h2>
      <ChessBoard squares={squares} onSquareClick={handleSquareClick} />
    </div>
  );
}

export default App;
