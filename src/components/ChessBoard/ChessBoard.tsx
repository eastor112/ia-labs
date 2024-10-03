import React from 'react';
import { Piece } from '../Chess/Piece';
import Square from './Square';

const ChessBoard: React.FC<{ squares: Array<Array<Piece | null>> }> = ({
  squares,
}) => {
  const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {columnLabels.map((label, index) => (
          <div
            key={index}
            style={{ width: '60px', textAlign: 'center', fontWeight: 'bold' }}
          >
            {label}
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            marginRight: '5px',
          }}
        >
          {Array.from({ length: 8 }, (_, i) => (
            <div
              key={i}
              style={{ height: '60px', lineHeight: '60px', fontWeight: 'bold' }}
            >
              {8 - i}{' '}
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)' }}>
          {squares.map((row, rowIndex) =>
            row.map((piece, colIndex) => {
              const isBlack = (rowIndex + colIndex) % 2 === 1;
              return (
                <Square
                  key={`${rowIndex}-${colIndex}`}
                  isBlack={isBlack}
                  row={rowIndex}
                  col={colIndex}
                >
                  {piece && (
                    <img
                      src={piece.img}
                      alt={piece.type}
                      style={{ width: '40px', height: '40px' }}
                    />
                  )}
                </Square>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
