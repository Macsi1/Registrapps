import { Component, OnInit } from '@angular/core';

interface DiaCalendario {
  fecha: Date;
  asistio?: boolean;
  esHoy: boolean;
}

@Component({
  selector: 'app-ingles',
  templateUrl: './ingles.page.html',
  styleUrls: ['./ingles.page.scss'],
})
export class InglesPage implements OnInit {
  calendario: DiaCalendario[][] = [];
  mesActual: Date = new Date();
  diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
  
  // Registro de asistencia (simulado)
  asistencias: Map<string, boolean> = new Map();

  constructor() {
    this.generarAsistenciasFijas();
  }

  ngOnInit() {
    this.generarCalendario();
  }

  private generarAsistenciasFijas() {
    const inicio = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const fin = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);

    // Definimos los días que NO asistió (faltas)
    const diasFalta = [7, 10, 11]; // Ejemplo: faltó los días 4, 11, 18 y 25 del mes

    for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
      if (d.getDay() >= 1 && d.getDay() <= 5) { // Solo días laborables
        const diaDelMes = d.getDate();
        // Si el día está en la lista de faltas, marca como false, sino true
        const asistio = !diasFalta.includes(diaDelMes);
        this.asistencias.set(d.toISOString().split('T')[0], asistio);
      }
    }
  }

  generarCalendario() {
    const primerDia = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const ultimoDia = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);
    
    this.calendario = [];
    let semanaActual: DiaCalendario[] = [];

    // Ajustamos al lunes anterior si el mes no empieza en lunes
    let diaActual = new Date(primerDia);
    while (diaActual.getDay() !== 1) {
      diaActual.setDate(diaActual.getDate() - 1);
    }

    while (diaActual <= ultimoDia || semanaActual.length > 0) {
      if (diaActual.getDay() >= 1 && diaActual.getDay() <= 5) { // Solo días de lunes a viernes
        const fecha = new Date(diaActual);
        semanaActual.push({
          fecha: fecha,
          asistio: this.asistencias.get(fecha.toISOString().split('T')[0]),
          esHoy: this.esMismaFecha(fecha, new Date())
        });
      }

      if (diaActual.getDay() === 5 || diaActual >= ultimoDia) { // Viernes o fin de mes
        if (semanaActual.length > 0) {
          this.calendario.push(semanaActual);
          semanaActual = [];
        }
      }

      diaActual.setDate(diaActual.getDate() + 1);
    }
  }

  mesAnterior() {
    this.mesActual.setMonth(this.mesActual.getMonth() - 1);
    this.generarCalendario();
  }

  mesSiguiente() {
    this.mesActual.setMonth(this.mesActual.getMonth() + 1);
    this.generarCalendario();
  }

  getNombreMes(): string {
    return this.mesActual.toLocaleString('es', { month: 'long' });
  }

  esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getDate() === fecha2.getDate() &&
           fecha1.getMonth() === fecha2.getMonth() &&
           fecha1.getFullYear() === fecha2.getFullYear();
  }

  getEstadisticas() {
    let total = 0;
    let asistidos = 0;

    this.asistencias.forEach((valor) => {
      total++;
      if (valor) asistidos++;
    });

    return {
      porcentaje: Math.round((asistidos / total) * 100),
      asistidos: asistidos,
      faltas: total - asistidos
    };
  }
}
