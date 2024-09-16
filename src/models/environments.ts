export type Casillas = {
  A: 'limpio' | 'sucio';
  B: 'limpio' | 'sucio';
};

export class Entorno {
  casillas: Casillas;

  constructor() {
    this.casillas = { A: 'limpio', B: 'sucio' };
  }

  ensuciar(): void {
    if (Math.random() < 0.1) {
      this.casillas.A = 'sucio';
    }

    if (Math.random() < 0.1) {
      this.casillas.B = 'sucio';
    }
  }

  limpiar(ubicacion: 'A' | 'B'): void {
    this.casillas[ubicacion] = 'limpio';
  }
}

export class Agente1 {
  ubicacion: 'A' | 'B';
  puntaje: number;

  constructor() {
    this.ubicacion = 'A';
    this.puntaje = 0;
  }

  actuar(entorno: Entorno): void {
    if (entorno.casillas[this.ubicacion] === 'sucio') {
      entorno.limpiar(this.ubicacion);
      this.puntaje -= 1;
    } else {
      this.ubicacion = this.ubicacion === 'A' ? 'B' : 'A';
      this.puntaje -= 1;
    }

    Object.values(entorno.casillas).forEach(estado => {
      if (estado === 'limpio') this.puntaje += 1;
    });
  }
}

export class Agente2 extends Agente1 {
  actuar(entorno: Entorno): void {
    if (Math.random() < 0.5) {
      return;
    }
    super.actuar(entorno);
  }
}
