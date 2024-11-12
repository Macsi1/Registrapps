import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

interface Seccion {
  id: number;
  nombre: string;
}

interface Asignatura {
  id: number;
  nombre: string;
  codigo: string;
  profesor: string;
  seccionId: number;
}

interface Alumno {
  id: string;
  nombre: string;
  correo: string;
  seccionId: number;
}

interface Asistencia {
  id: number;
  alumnoId: string;
  asignaturaId: number;
  codigoAsignatura: string;
  fecha: Date;
  presente: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AsistenciaService {
  // Subject para notificar cambios en la asistencia
  private asistenciaActualizadaSubject = new Subject<void>();
  asistenciaActualizada$ = this.asistenciaActualizadaSubject.asObservable();

  private secciones: Seccion[] = [
    { id: 1, nombre: 'PGY4121-002D' },
    { id: 2, nombre: 'PGY4121-003D' },
    { id: 3, nombre: 'CSY4111-003D' }
  ];

  private asignaturas = [
    // Sección PGY4121-002D
    { id: 1, nombre: 'Programación de Apps Móviles', codigo: 'APM001', profesor: 'María González', seccionId: 1 },
    { id: 2, nombre: 'Arquitectura de Software', codigo: 'ARQ001', profesor: 'María González', seccionId: 1 },
    { id: 3, nombre: 'Base de Datos', codigo: 'BDD001', profesor: 'María González', seccionId: 1 },
    { id: 4, nombre: 'Desarrollo Web', codigo: 'DEW001', profesor: 'María González', seccionId: 1 },
  ];

  private asistencias: { [codigo: string]: Asistencia[] } = {};

  private alumnos = [
    { 
      id: "3", 
      nombre: "pedro", 
      correo: "pe@correo.cl",
      seccionId: 1  // Alumno de la sección PGY4121-002D
    },
    { 
      id: "4", 
      nombre: "diana", 
      correo: "di@correo.cl",
      seccionId: 2  // Alumno de la sección PGY4121-003D
    }
  ];

  // Simular alumno actual (esto debería venir de tu servicio de autenticación)
  private alumnoActual = this.alumnos.find(a => a.id === "3");

  constructor() {
    // Inicializar asistencias para cada asignatura
    this.asignaturas.forEach(asignatura => {
      this.asistencias[asignatura.codigo] = [];
    });

    // Simular alumno logueado (esto debería venir de tu servicio de autenticación)
    this.alumnoActual = this.alumnos.find(a => a.id === "3") || undefined;
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
    return this.asignaturas.find(a => a.codigo === codigo);
  }

  obtenerAsistenciasPorAsignatura(codigo: string) {
    return this.asistencias[codigo] || [];
  }

  async registrarAsistencia(codigoQR: string): Promise<boolean> {
    if (!this.alumnoActual) {
      throw new Error('No hay un alumno autenticado');
    }

    const asignatura = this.obtenerAsignaturaPorCodigo(codigoQR);
    
    if (!asignatura) {
      throw new Error('Código QR inválido');
    }

    if (asignatura.seccionId !== this.alumnoActual.seccionId) {
      throw new Error('No perteneces a esta sección');
    }

    // Verificar si ya existe una asistencia para hoy
    const hoy = new Date();
    const asistenciaExistente = this.asistencias[codigoQR].find(a => 
      a.alumnoId === this.alumnoActual?.id && 
      a.codigoAsignatura === codigoQR &&
      this.esMismaFecha(new Date(a.fecha), hoy)
    );

    if (asistenciaExistente) {
      return false;
    }

    // Registrar nueva asistencia
    const nuevaAsistencia: Asistencia = {
      id: this.asistencias[codigoQR].length + 1,
      alumnoId: this.alumnoActual.id,
      asignaturaId: this.obtenerAsignaturaPorCodigo(codigoQR)?.id || 0,
      codigoAsignatura: codigoQR,
      fecha: new Date(),
      presente: true
    };

    this.asistencias[codigoQR].push(nuevaAsistencia);
    return true;
  }

  public esMismaFecha(fecha1: Date, fecha2: Date): boolean {
    return fecha1.getFullYear() === fecha2.getFullYear() &&
           fecha1.getMonth() === fecha2.getMonth() &&
           fecha1.getDate() === fecha2.getDate();
  }

  // Nuevo método para obtener asignaturas por profesor
  obtenerAsignaturasPorProfesor(nombreProfesor: string) {
    return this.asignaturas.filter(asignatura => 
      asignatura.profesor === nombreProfesor
    );
  }

  // Nuevo método para obtener secciones por profesor
  obtenerSeccionesPorProfesor(nombreProfesor: string): Seccion[] {
    const asignaturasProfesor = this.obtenerAsignaturasPorProfesor(nombreProfesor);
    const seccionesIds = [...new Set(asignaturasProfesor.map(a => a.seccionId))];
    return this.secciones.filter(seccion => seccionesIds.includes(seccion.id));
  }

  // Nuevo método para obtener asignaturas por sección
  obtenerAsignaturasPorSeccion(seccionId: number, nombreProfesor: string) {
    return this.asignaturas.filter(asignatura => 
      asignatura.seccionId === seccionId && 
      asignatura.profesor === nombreProfesor
    );
  }

  obtenerSeccionAlumno(): number | null {
    return this.alumnoActual?.seccionId || null;
  }

  obtenerAsistenciasAlumno(alumnoId: string) {
    console.log('Buscando asistencias para alumno:', alumnoId); // Debug

    const alumno = this.alumnos.find(a => a.id === alumnoId);
    if (!alumno) {
      console.log('Alumno no encontrado'); // Debug
      return [];
    }

    console.log('Sección del alumno:', alumno.seccionId); // Debug

    // Obtener asignaturas de la sección del alumno
    const asignaturasSeccion = this.asignaturas.filter(
      asig => asig.seccionId === alumno.seccionId
    );
    console.log('Asignaturas de la sección:', asignaturasSeccion); // Debug

    // Obtener asistencias del alumno
    const todasLasAsistencias = Object.values(this.asistencias).flat();
    const asistenciasAlumno = todasLasAsistencias.filter((asistencia: Asistencia) => {
      const asignaturaCorrespondiente = asignaturasSeccion.find(
        (asig: Asignatura) => asig.codigo === asistencia.codigoAsignatura
      );
      return asistencia.alumnoId === alumnoId && asignaturaCorrespondiente;
    });

    console.log('Asistencias encontradas:', asistenciasAlumno); // Debug

    // Mapear las asistencias con la información de la asignatura
    return asistenciasAlumno.map((asistencia: Asistencia) => {
      const asignatura = this.asignaturas.find(
        (a: Asignatura) => a.codigo === asistencia.codigoAsignatura
      );
      return {
        id: asistencia.id,
        fecha: asistencia.fecha,
        presente: asistencia.presente,
        asignaturaNombre: asignatura?.nombre || 'Desconocida',
        codigoAsignatura: asistencia.codigoAsignatura
      };
    });
  }

  obtenerAsistenciasPorSeccion(seccionId: number) {
    // Obtener asignaturas de la sección
    const asignaturasSeccion = this.asignaturas.filter(
      asig => asig.seccionId === seccionId
    );

    // Obtener alumnos de la sección
    const alumnosSeccion = this.alumnos.filter(
      alumno => alumno.seccionId === seccionId
    );

    // Combinar todas las asistencias de los alumnos de la sección
    const todasLasAsistencias = alumnosSeccion.map((alumno: Alumno) =>
      this.asistencias[alumno.id] || []
    ).flat();

    return todasLasAsistencias;
  }
}
