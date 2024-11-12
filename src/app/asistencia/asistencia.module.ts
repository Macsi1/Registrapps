import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AsistenciaPage } from './asistencia.page';
import { AsistenciaPageRoutingModule } from './asistencia-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AsistenciaPageRoutingModule
  ],
  declarations: [AsistenciaPage]
})
export class AsistenciaPageModule {}
