import React from 'react';
import { Entorno } from '../../models/environments';

interface BoardProps {
  entorno: Entorno;
  ubicacion: 'A' | 'B';
}

const Board: React.FC<BoardProps> = ({ entorno, ubicacion }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '20px' }}>
      <div
        style={{ padding: '10px', margin: '10px', border: '1px solid black' }}
        className={ubicacion === 'A' ? 'bg-blue-400' : ''}
      >
        <h3>Casilla A</h3>
        <p>{entorno.casillas.A}</p>
      </div>
      <div
        style={{ padding: '10px', margin: '10px', border: '1px solid black' }}
        className={ubicacion === 'B' ? 'bg-blue-400' : ''}
      >
        <h3>Casilla B</h3>
        <p>{entorno.casillas.B}</p>
      </div>
    </div>
  );
};

export default Board;
