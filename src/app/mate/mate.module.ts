import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MatePageRoutingModule } from './mate-routing.module';

import { MatePage } from './mate.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MatePageRoutingModule
  ],
  declarations: [MatePage]
})
export class MatePageModule {}
