import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { LoadingController, ModalController, Platform } from '@ionic/angular';
import { AsistenciaService } from '../services/asistencia.service';

@Component({
  selector: 'app-generar',
  templateUrl: './generar.page.html',
  styleUrls: ['./generar.page.scss'],
})
export class GenerarPage {

  qrText: string = '';
  seccionSeleccionada: number | null = null;
  secciones: any[] = [];
  asignaturas: any[] = [];
  profesorActual: string = '';

  constructor(
    private loadingController: LoadingController,
    private platform: Platform,
    private modalController: ModalController,
    private asistenciaService: AsistenciaService
  ) {
    this.cargarDatosProfesor();
  }

  async cargarDatosProfesor() {
    this.profesorActual = 'María González';
    this.secciones = this.asistenciaService.obtenerSeccionesPorProfesor(this.profesorActual);
  }

  onSeccionChange(event: any) {
    const seccionId = Number(event.detail.value);
    this.seccionSeleccionada = seccionId;
    this.asignaturas = this.asistenciaService.obtenerAsignaturasPorSeccion(
      seccionId,
      this.profesorActual
    );
  }

  captureScreen(){
    const element = document.getElementById('qrImage') as HTMLElement;
    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      this.downloadImage(canvas);
      if(this.platform.is('capacitor'))
        this.shareImage(canvas);
      else this.downloadImage(canvas);
    });
  }

  downloadImage(canvas: HTMLCanvasElement){
    const link = document.createElement('a');
    link.download = 'qrc.png';
    link.href = canvas.toDataURL();
    link.click();
  }
  async shareImage(canvas: HTMLCanvasElement){

    let path = 'qrc.png';
    let base64 = canvas.toDataURL();
    
      const loading = await this.loadingController.create({spinner: 'bubbles'});
      await loading.present();
    
    await Filesystem.writeFile({
      path,
      data: base64,
      directory: Directory.Cache,
    }).then(async (res) => {
      let uri = res.uri;
      await Share.share({url: uri});

      await Filesystem.deleteFile({path, directory: Directory.Cache});
    }).finally(()=>{
      loading.dismiss();
    })

  }
}
