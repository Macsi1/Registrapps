import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MatePage } from './mate.page';

const routes: Routes = [
  {
    path: '',
    component: MatePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MatePageRoutingModule {}
