import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AsignaturaDetallePage } from './asignatura-detalle.page';

const routes: Routes = [
  {
    path: '',
    component: AsignaturaDetallePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AsignaturaDetallePageRoutingModule {}
