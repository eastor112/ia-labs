import { Game } from './components/Chess/Game';
import ChessBoard from './components/ChessBoard/ChessBoard';

function App() {
  const game = new Game();
  const squares = game.getBoard();

  return (
    <div className='flex justify-center'>
      {/* <AgentComparator /> */}
      <ChessBoard squares={squares} />
    </div>
  );
}

export default App;
