import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Asignatura {
  codigo: string;
  nombre: string;
  diasAsistidos: number;
  diasFaltados: number;
  porcentajeAsistencia: number;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  // Subject para notificar cambios en la asistencia
  private asistenciaActualizadaSubject = new Subject<void>();
  asistenciaActualizada$ = this.asistenciaActualizadaSubject.asObservable();

  private asignaturas = [
    { id: 2, nombre: 'Lenguaje', codigo: 'LEN101', profesor: 'María González' },
    { id: 3, nombre: 'Matemáticas', codigo: 'MAT101', profesor: 'Pedro Sánchez' },
    { id: 4, nombre: 'Historia', codigo: 'HIS101', profesor: 'Ana Martínez' },
    { id: 5, nombre: 'Inglés', codigo: 'ING101', profesor: 'Carlos López' },
    { id: 6, nombre: 'Ciencias', codigo: 'CIE101', profesor: 'Laura Torres' }
  ];

  private asistencias: { [key: string]: any[] } = {};

  constructor() {
    // Inicializar asistencias para cada asignatura
    this.asignaturas.forEach(asignatura => {
      this.asistencias[asignatura.codigo] = [];
    });
  }

  // Método para obtener todas las asignaturas
  getAsignaturas() {
    const asignaturas = this.obtenerAsignaturasInscritas();
    return asignaturas.map(asignatura => {
      const diasDelMes = this.calcularDiasMes(asignatura.codigo);
      const asistenciasDelMes = this.obtenerAsistenciasMes(asignatura.codigo);
      const diasAsistidos = asistenciasDelMes.length;
      const diasFaltados = diasDelMes - diasAsistidos;
      const porcentajeAsistencia = diasDelMes > 0 
        ? Math.round((diasAsistidos / diasDelMes) * 100) 
        : 0;

      return {
        ...asignatura,
        diasAsistidos,
        diasFaltados,
        porcentajeAsistencia
      };
    });
  }

  private calcularDiasMes(codigoAsignatura: string): number {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    let totalDias = 0;
    
    for (let d = new Date(primerDiaMes); d <= hoy; d.setDate(d.getDate() + 1)) {
      if (d.getDay() !== 0 && d.getDay() !== 6) { // Excluye fines de semana
        totalDias++;
      }
    }
    
    return totalDias;
  }

  private obtenerAsistenciasMes(codigoAsignatura: string): any[] {
    const hoy = new Date();
    const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
    const asistencias = this.obtenerAsistenciasPorAsignatura(codigoAsignatura);
    
    return asistencias.filter(asistencia => {
      const fechaAsistencia = new Date(asistencia.fecha);
      return fechaAsistencia >= primerDiaMes && fechaAsistencia <= hoy;
    });
  }

  obtenerAsignaturasInscritas() {
    return this.asignaturas;
  }

  obtenerAsignaturaPorCodigo(codigo: string) {
    return this.asignaturas.find(asignatura => asignatura.codigo === codigo);
  }

  obtenerAsistenciasPorAsignatura(codigo: string) {
    return this.asistencias[codigo] || [];
  }

  registrarAsistencia(codigoAsignatura: string, fecha: Date = new Date()) {
    if (!this.asistencias[codigoAsignatura]) {
      this.asistencias[codigoAsignatura] = [];
    }
    
    const existeAsistencia = this.asistencias[codigoAsignatura].some(
      asistencia => this.esMismaFecha(new Date(asistencia.fecha), fecha)
    );

    if (!existeAsistencia) {
      this.asistencias[codigoAsignatura].push({
        fecha: fecha,
        presente: true
      });
      // Notificar que la asistencia ha sido actualizada
      this.asistenciaActualizadaSubject.next();
      return true;
    }
    return false;
  }

  esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
           fecha1.getMonth() === fecha2.getMonth() &&
           fecha1.getDate() === fecha2.getDate();
  }
}
