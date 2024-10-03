import { Agente1, Agente2 } from "../../models/environments";
import AgentSimulator from "../AgentSimulator/AgentSimulator";

function AgentComparator() {
  const agente1 = new Agente1();
  const agente2 = new Agente2();

  return (
    <div>
      <div className='flex gap-8'>
        <AgentSimulator agente={agente1} title='Simulación del Agente 1' />

        <AgentSimulator agente={agente2} title='Simulación del Agente 2' />
      </div>
    </div>
  );
}

export default AgentComparator;
