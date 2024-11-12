import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsistenciaService } from '../services/asistencia.service';

interface DiaAsistencia {
  fecha: Date;
  asistio: boolean;
}

@Component({
  selector: 'app-asignatura-detalle',
  templateUrl: './asignatura-detalle.page.html',
  styleUrls: ['./asignatura-detalle.page.scss'],
})
export class AsignaturaDetallePage implements OnInit {
  asignatura: any;
  asistencias: any[] = [];
  mesActual: Date = new Date();
  diasDelMes: DiaAsistencia[] = [];
  hoy: Date = new Date();

  constructor(
    private route: ActivatedRoute,
    private asistenciaService: AsistenciaService
  ) {
    this.hoy.setHours(0, 0, 0, 0);
  }

  ngOnInit() {
    const codigo = this.route.snapshot.paramMap.get('codigo');
    if (codigo) {
      this.asignatura = this.asistenciaService.obtenerAsignaturaPorCodigo(codigo);
      this.cargarAsistencias(codigo);
      this.generarDiasDelMes();
    }
  }

  cargarAsistencias(codigo: string) {
    this.asistencias = this.asistenciaService.obtenerAsistenciasPorAsignatura(codigo);
  }

  generarDiasDelMes() {
    const primerDia = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth(), 1);
    const ultimoDia = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1, 0);
    
    this.diasDelMes = [];
    for (let d = new Date(primerDia); d <= ultimoDia; d.setDate(d.getDate() + 1)) {
      const fecha = new Date(d);
      fecha.setHours(0, 0, 0, 0);
      
      if (fecha <= this.hoy) {
        this.diasDelMes.push({
          fecha: fecha,
          asistio: this.verificarAsistencia(fecha)
        });
      }
    }
  }

  getTotalAsistencias(): number {
    return this.diasDelMes.filter(dia => dia.asistio).length;
  }

  calcularPorcentajeAsistencia(): number {
    if (this.diasDelMes.length === 0) return 0;
    return (this.getTotalAsistencias() / this.diasDelMes.length) * 100;
  }

  verificarAsistencia(fecha: Date): boolean {
    return this.asistencias.some(asistencia => 
      this.asistenciaService.esMismaFecha(new Date(asistencia.fecha), fecha)
    );
  }

  mesAnterior() {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() - 1);
    this.generarDiasDelMes();
  }

  mesSiguiente() {
    this.mesActual = new Date(this.mesActual.getFullYear(), this.mesActual.getMonth() + 1);
    this.generarDiasDelMes();
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-ES', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }
}
