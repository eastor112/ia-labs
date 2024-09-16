import React, { useState } from 'react';
import { Agente1, Agente2, Entorno } from '../../models/environments';
import Board from '../Board/Board';
import Controls from '../Controls/Controls';

interface AgentSimulatorProps {
  agente: Agente1 | Agente2;
  title: string;
}

const AgentSimulator: React.FC<AgentSimulatorProps> = ({ agente, title }) => {
  const [entorno] = useState<Entorno>(new Entorno());
  const [pasos, setPasos] = useState<number>(0);
  const [cambio, setCambio] = useState(false);
  const [actuo, setActuo] = useState(false);

  const ejecutarPaso = () => {
    const cambio = entorno.ensuciar();
    if (cambio) {
      setCambio(true);
      return;
    }
    setCambio(false);

    const actuo = agente.actuar(entorno);
    setActuo(actuo);

    setPasos(pasos + 1);
  };

  const ejecutarNpasos = (n: number) => {
    for (let i = 0; i < n; i++) {
      const cambio = entorno.ensuciar();

      if (cambio) {
        setCambio(true);
        i--;
        continue;
      }

      agente.actuar(entorno);
    }
    setPasos(pasos + n);
  };

  return (
    <div className='flex flex-col items-center'>
      <h2>{title}</h2>
      <Board entorno={entorno} ubicacion={agente.ubicacion} />

      {cambio && (
        <small className='text-red-500'>Una de las casillas se ensució</small>
      )}

      {!actuo && pasos > 0 && (
        <small className='text-red-500'>El agente no hizo nada</small>
      )}

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
