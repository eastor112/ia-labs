export class Piece {
  constructor(public type: string, public color: 'black' | 'white') { }

  get img(): string {
    return `/pieces/${this.color}_${this.type}.png`;
  }
}
