import AgentSimulator from './components/AgentSimulator/AgentSimulator';
import { Agente1, Agente2 } from './models/environments';

function App() {
  const agente1 = new Agente1();
  const agente2 = new Agente2();

  return (
    <div className='flex justify-center'>
      <div className='flex gap-8'>
        <AgentSimulator agente={agente1} title='Simulación del Agente 1' />

        <AgentSimulator agente={agente2} title='Simulación del Agente 2' />
      </div>
    </div>
  );
}

export default App;
