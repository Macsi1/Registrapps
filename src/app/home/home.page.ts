import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { LoadingController, Platform } from '@ionic/angular';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  nombreUsuario: string = '';
  isProfesor: boolean = false;
  showFunctionality: boolean = false;
  qrText: string = '';
  
  images = [
    { 
      url: 'https://www.qualitydevs.com/wp-content/uploads/2021/03/Desarrollo-apps-moviles.jpg', 
      alt: 'Programación de Apps Móviles',
      route: '/asignatura-detalle/APM001',
      codigo: 'APM001'
    },
    { 
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSy2ZX3Wn8eGfskXO4GutJ_VyN-5YMXcqOQpg&s', 
      alt: 'Arquitectura de Software',
      route: '/asignatura-detalle/ARQ001',
      codigo: 'ARQ001'
    },
    { 
      url: 'https://www.astera.com/wp-content/uploads/2019/05/DBI-1.jpg', 
      alt: 'Base de Datos',
      route: '/asignatura-detalle/BDD001',
      codigo: 'BDD001'
    },
    { 
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-XNpCZ0JWKAqrw-IN5Db3PexXCzsWQ4XFWA&s', 
      alt: 'Desarrollo Web',
      route: '/asignatura-detalle/DEW001',
      codigo: 'DEW001'
    }
  ];
  
  constructor(
    private storageService: StorageService,
    private router: Router,
    private platform: Platform,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    this.cargarDatosUsuario();
  }

  cargarDatosUsuario() {
    const userData = this.storageService.getItem('userData');
    if (userData) {
      this.nombreUsuario = userData.nombre;
      this.isProfesor = userData.rol === 'profesor';
    }
  }

  navigateToPage(asignatura: string) {
    const selectedImage = this.images.find(img => img.alt === asignatura);
    
    if (selectedImage) {
      if (this.isProfesor) {
        this.router.navigate(['/generar']);
      } else {
        this.router.navigate([selectedImage.route]);
      }
    }
  }

  toggleFunctionality() {
    this.showFunctionality = !this.showFunctionality;
  }

  captureScreen() {
    const element = document.getElementById('qrImage') as HTMLElement;
    html2canvas(element).then((canvas: HTMLCanvasElement) => {
      this.downloadImage(canvas);
      if(this.platform.is('capacitor'))
        this.shareImage(canvas);
      else this.downloadImage(canvas);
    });
  }

  downloadImage(canvas: HTMLCanvasElement) {
    const link = document.createElement('a');
    link.download = 'qrc.png';
    link.href = canvas.toDataURL();
    link.click();
  }

  async shareImage(canvas: HTMLCanvasElement) {
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
    }).finally(() => {
      loading.dismiss();
    });
  }
}
