import { Piece } from './Piece';

export type PieceColor = 'white' | 'black';

export class ChessGame {
  board: Array<Array<Piece | null>>;
  currentTurn: PieceColor;

  constructor() {
    this.board = this.initializeBoard();
    this.currentTurn = 'white';
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

  nextTurn(): void {
    this.currentTurn = this.currentTurn === 'white' ? 'black' : 'white';
  }

  getCurrentTurn(): PieceColor {
    return this.currentTurn;
  }

  movePiece(fromRow: number, fromCol: number, toRow: number, toCol: number): boolean {
    const piece = this.board[fromRow][fromCol];

    if (!piece) {
      return false;
    }

    if (piece.color !== this.currentTurn) {
      return false;
    }

    const destination = this.board[toRow][toCol];
    if (destination && destination.color === piece.color) {
      return false;
    }

    this.board[toRow][toCol] = piece;
    this.board[fromRow][fromCol] = null;

    this.nextTurn();

    return true;
  }
}
