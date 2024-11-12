import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AsignaturaDetallePageRoutingModule } from './asignatura-detalle-routing.module';

import { AsignaturaDetallePage } from './asignatura-detalle.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AsignaturaDetallePageRoutingModule
  ],
  declarations: [AsignaturaDetallePage]
})
export class AsignaturaDetallePageModule {}
