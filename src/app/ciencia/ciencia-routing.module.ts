import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CienciaPage } from './ciencia.page';

const routes: Routes = [
  {
    path: '',
    component: CienciaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CienciaPageRoutingModule {}
