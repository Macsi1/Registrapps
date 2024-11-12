import { Component, OnInit } from '@angular/core';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit {
  asistencias: any[] = [];

  constructor(
    private asistenciaService: AsistenciaService
  ) {}

  ngOnInit() {
    // Por ahora usamos un ID hardcodeado (después deberás obtenerlo de tu sistema de autenticación)
    this.cargarAsistencias("3");
  }

  cargarAsistencias(alumnoId: string) {
    this.asistencias = this.asistenciaService.obtenerAsistenciasAlumno(alumnoId);
    console.log('Asistencias cargadas:', this.asistencias); // Debug
  }
}
