import React, { useState } from 'react';
import { Agente1, Agente2, Entorno } from '../../models/environments';
import Board from '../Board/Board';
import Controls from '../Controls/Controls';

interface AgentSimulatorProps {
  agente: Agente1 | Agente2;
  title: string;
}

const AgentSimulator: React.FC<AgentSimulatorProps> = ({ agente, title }) => {
  const [entorno, setEntorno] = useState<Entorno>(new Entorno());
  const [pasos, setPasos] = useState<number>(0);

  const ejecutarPaso = () => {
    entorno.ensuciar();
    agente.actuar(entorno);
    setEntorno(entorno);
    setPasos(pasos + 1);
  };

  const ejecutarNpasos = (n: number) => {
    for (let i = 0; i < n; i++) {
      entorno.ensuciar();
      agente.actuar(entorno);
    }
    setEntorno(entorno);
    setPasos(pasos + n);
  };

  return (
    <div className='flex flex-col items-center'>
      <h2>{title}</h2>
      <Board entorno={entorno} ubicacion={agente.ubicacion} />

      <div className='mt-4'>
        <div className='mb-4'>
          <p>Pasos: {pasos}</p>
          <p>Puntaje: {agente.puntaje}</p>
        </div>

        <Controls onEjecutarPaso={ejecutarPaso} text='Ejecutar 1 paso' />

        <Controls
          onEjecutarPaso={() => ejecutarNpasos(1000)}
          text='Ejecutar 1000 pasos'
        />
      </div>
    </div>
  );
};

export default AgentSimulator;
