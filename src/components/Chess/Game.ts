import { Piece } from './Piece';

export class Game {
  board: Array<Array<Piece | null>>;

  constructor() {
    this.board = this.initializeBoard();
  }

  private initializeBoard(): Array<Array<Piece | null>> {
    const initialPieces: Piece[] = [];

    initialPieces.push(new Piece('rook', 'black'));
    initialPieces.push(new Piece('knight', 'black'));
    initialPieces.push(new Piece('bishop', 'black'));
    initialPieces.push(new Piece('queen', 'black'));
    initialPieces.push(new Piece('king', 'black'));
    initialPieces.push(new Piece('bishop', 'black'));
    initialPieces.push(new Piece('knight', 'black'));
    initialPieces.push(new Piece('rook', 'black'));
    for (let i = 0; i < 8; i++) {
      initialPieces.push(new Piece('pawn', 'black'));
    }

    initialPieces.push(new Piece('rook', 'white'));
    initialPieces.push(new Piece('knight', 'white'));
    initialPieces.push(new Piece('bishop', 'white'));
    initialPieces.push(new Piece('queen', 'white'));
    initialPieces.push(new Piece('king', 'white'));
    initialPieces.push(new Piece('bishop', 'white'));
    initialPieces.push(new Piece('knight', 'white'));
    initialPieces.push(new Piece('rook', 'white'));
    for (let i = 0; i < 8; i++) {
      initialPieces.push(new Piece('pawn', 'white'));
    }

    const board: Array<Array<Piece | null>> = Array(8)
      .fill(null)
      .map(() => Array(8).fill(null));

    for (let i = 0; i < 8; i++) {
      board[0][i] = initialPieces[i];
      board[1][i] = initialPieces[i + 8];
    }

    for (let i = 0; i < 8; i++) {
      board[7][i] = initialPieces[i + 16];
      board[6][i] = initialPieces[i + 24];
    }

    return board;
  }

  getBoard(): Array<Array<Piece | null>> {
    return this.board;
  }
}
