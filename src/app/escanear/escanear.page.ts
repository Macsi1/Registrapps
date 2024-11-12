import { Component, OnInit } from '@angular/core';
import { LoadingController, ModalController, Platform, ToastController, AlertController } from '@ionic/angular';
import { BarcodeScanningModalComponent } from './barcode-scanning-modal.component';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import jsQR from 'jsqr';
import { FilePicker } from '@capawesome/capacitor-file-picker';
import { Clipboard } from '@capacitor/clipboard';
import { Browser } from '@capacitor/browser';
import { AsistenciaService } from '../services/asistencia.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-escanear',
  templateUrl: './escanear.page.html',
  styleUrls: ['./escanear.page.scss'],
})
export class EscanearPage implements OnInit{
  // yorch-dev.com
  scanResult = '';
  codigoAsignatura = '';
  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private modalController: ModalController,
    private toastController: ToastController,
    private alertController: AlertController,
    private asistenciaService: AsistenciaService,
    private router: Router
  ){}
  ngOnInit(): void {
    if(this.platform.is('capacitor')) {
      // Solo necesitamos verificar el permiso
      BarcodeScanner.checkPermission().then();
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
  async readBarcodeFromImage(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e: any) => {
        const imageData = e.target.result;
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const context = canvas.getContext('2d');
          context?.drawImage(img, 0, 0);
          const imageData = context?.getImageData(0, 0, canvas.width, canvas.height);
          
          if (imageData) {
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code) {
              this.scanResult = code.data;
            } else {
              // Manejar el caso cuando no se detecta código QR
              console.log('No se detectó ningún código QR');
            }
          }
        };
        img.src = imageData;
      };
      reader.readAsDataURL(file);
    }
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

  async registrarAsistencia() {
    if (this.scanResult) {
      const loading = await this.loadingController.create({
        message: 'Verificando código...',
      });
      await loading.present();

      try {
        const asignatura = this.asistenciaService.obtenerAsignaturaPorCodigo(this.scanResult);
        
        if (!asignatura) {
          throw new Error('Código QR inválido. No corresponde a ninguna asignatura.');
        }

        const registroExitoso = await this.asistenciaService.registrarAsistencia(this.scanResult);
        
        const toast = await this.toastController.create({
          message: registroExitoso 
            ? 'Asistencia registrada correctamente para ' + asignatura.nombre
            : 'Ya existe un registro de asistencia para hoy en ' + asignatura.nombre,
          duration: 2000,
          position: 'bottom',
          color: registroExitoso ? 'success' : 'warning'
        });
        
        await loading.dismiss();
        toast.present();
        
        if (registroExitoso) {
          this.router.navigate(['/asistencia']);
        }

      } catch (error: any) {
        await loading.dismiss();
        
        const toast = await this.toastController.create({
          message: error.message || 'Error al registrar la asistencia',
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        });
        toast.present();
      }
    }
  }
}
    