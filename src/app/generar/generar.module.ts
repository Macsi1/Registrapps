import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


import { IonicModule } from '@ionic/angular';

import { GenerarPageRoutingModule } from './generar-routing.module';

import { GenerarPage } from './generar.page';
import { QrCodeModule } from 'ng-qrcode';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GenerarPageRoutingModule,
    QrCodeModule
  ],
  declarations: [GenerarPage, BarcodeScanningModalComponent]
})
export class GenerarPageModule {}
