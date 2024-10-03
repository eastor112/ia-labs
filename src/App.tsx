import { ChessGame } from './components/Chess/Game';
import ChessBoard from './components/ChessBoard/ChessBoard';

function App() {
  const game = new ChessGame();
  const squares = game.getBoard();
  const currentTurn = game.getCurrentTurn();

  return (
    <div className='justify-center'>
      {/* <AgentComparator /> */}
      <h1>Juego de Ajedrez Inteligente</h1>

      <h2>Turno actual: {currentTurn === 'white' ? 'Blanco' : 'Negro'}</h2>
      <ChessBoard squares={squares} />
    </div>
  );
}

export default App;
