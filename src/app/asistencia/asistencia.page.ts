import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AsistenciaService } from '../services/asistencia.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-asistencia',
  templateUrl: './asistencia.page.html',
  styleUrls: ['./asistencia.page.scss'],
})
export class AsistenciaPage implements OnInit, OnDestroy {
  asignaturas: any[] = [];
  private subscription!: Subscription;

  constructor(
    private asistenciaService: AsistenciaService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.cargarAsignaturas();
    
    // Suscribirse a las actualizaciones de asistencia
    this.subscription = this.asistenciaService.asistenciaActualizada$
      .subscribe(() => {
        this.cargarAsignaturas();
      });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  cargarAsignaturas() {
    this.asignaturas = this.asistenciaService.getAsignaturas();
    // Forzar detección de cambios
    this.changeDetectorRef.detectChanges();
  }

  verDetalleAsistencia(asignatura: any) {
    this.router.navigate(['/asignatura-detalle', asignatura.codigo]);
  }

  getColorPorcentaje(porcentaje: number): string {
    if (porcentaje >= 80) return 'success';
    if (porcentaje >= 60) return 'warning';
    return 'danger';
  }
}
