import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CienciaPageRoutingModule } from './ciencia-routing.module';

import { CienciaPage } from './ciencia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CienciaPageRoutingModule
  ],
  declarations: [CienciaPage]
})
export class CienciaPageModule {}
