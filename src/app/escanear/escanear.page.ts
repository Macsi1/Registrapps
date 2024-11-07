import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController, AlertController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage implements OnInit{
  // yorch-dev.com
  scanResult = '';
  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController
  ){}
  ngOnInit(): void {
    if(this.platform.is('capacitor'))
    {
      BarcodeScanner.isSupported().then();
      BarcodeScanner.checkPermissions().then(); 
      BarcodeScanner.removeAllListeners().then();
      }
    }
  

  async startScan(){
    const modal = await this.modalController.create({
      component: BarcodeScanningModalComponent,
      cssClass: 'barcode-scanner-modal',
      showBackdrop: false,
      componentProps: {
        formats:[],
        lensFacing: 'LensFacing.Back'
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    if(data){
      this.scanResult = data?.barcode?.displayValue;
    }
  }
  async readBarcodeFromImage(){
    const { files } = await FilePicker.pickFiles({ readData: false });
    const path = files[0]?.path;
    if(!path) return;
    const { barcodes } = await BarcodeScanner.readBarcodesFromImage({
      path,
      formats: []
    })
    this.scanResult = barcodes[0].displayValue;
  }

  writeToClipboard = async () => {
    await Clipboard.write({
      string: this.scanResult
    });
    
      const toast = await this.toastController.create({
        message: 'Copiado al portapapeles',
        duration: 1000,
        color: 'primary',
        icon: 'clipboard-outline',
        position: 'middle'
      });
      toast.present();
    
  };


  async openCapacitorSite() {
    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: 'Quieres abrir este enlace en el navegador?',
      mode: 'ios',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        }, 
        {
          text: 'Aceptar',
          handler: async () => {
            let url = this.scanResult;
            if (!url.startsWith('https://')) {
              url = 'https://' + url;
            }
            await Browser.open({ url });
          }
        }
      ]
    });
  
    await alert.present();
  }

  isUrl(){
    let regex = /\.(com|net|io|me|crypto|ai)\b/i;
    return regex.test(this.scanResult);
  }
}
    