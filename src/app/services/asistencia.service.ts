import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  private asistencias = {
    matematicas: {
      nombre: 'Matemáticas',
      diasFalta: [8, 16, 21, 25]
    },
    lengua: {
      nombre: 'Lengua',
      diasFalta: [7, 8, 9, 29]
    },
    ciencia: {
      nombre: 'Ciencias',
      diasFalta: [1, 31]
    },
    ingles: {
      nombre: 'Inglés',
      diasFalta: [7, 10, 11]
    },
    historia: {
      nombre: 'Historia',
      diasFalta: [28]
    }
  };

  constructor() { }

  calcularEstadisticas(diasFalta: number[]) {
    const diasLaborablesMes = 23; // Aproximado
    const faltas = diasFalta.length;
    const asistidos = diasLaborablesMes - faltas;
    const porcentaje = Math.round((asistidos / diasLaborablesMes) * 100);

    return {
      porcentaje,
      asistidos,
      faltas
    };
  }

  obtenerTodasLasAsistencias() {
    return Object.values(this.asistencias).map(materia => ({
      nombre: materia.nombre,
      estadisticas: this.calcularEstadisticas(materia.diasFalta)
    }));
  }
} 