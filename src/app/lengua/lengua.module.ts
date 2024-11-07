import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LenguaPageRoutingModule } from './lengua-routing.module';

import { LenguaPage } from './lengua.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LenguaPageRoutingModule
  ],
  declarations: [LenguaPage]
})
export class LenguaPageModule {}
