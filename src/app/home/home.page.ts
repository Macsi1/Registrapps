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
  isProfesor: boolean = false;
  showFunctionality: boolean = false;
  qrText: string = '';
  
  images = [
    { 
      url: 'https://cdn-icons-png.flaticon.com/512/3589/3589030.png', 
      alt: 'Asistencia',
      route: '/asistencia'
    },
    { 
      url: 'https://img.freepik.com/vector-gratis/gente-hablando-distintos-idiomas-dibujado-mano_23-2147867238.jpg', 
      alt: 'Lenguaje',
      route: '/lengua'
    },
    { 
      url: 'https://img.freepik.com/vector-premium/doodle-matematicas-formulas-matematicas-dibujadas-mano-pizarra-portada-libro-banner-fondo-etc-industria-educacion-teoria-matematica-educacion-escolar_93083-3366.jpg', 
      alt: 'Matemáticas',
      route: '/mate'
    },
    { 
      url: 'https://www.lifeder.com/wp-content/uploads/2021/06/Orange-and-Yellow-Illustrated-International-Museum-Day-Social-Media-Poster.jpg', 
      alt: 'Historia',
      route: '/historia'
    },
    { 
      url: 'https://i.pinimg.com/736x/50/27/ed/5027ed356cdd9fbf558bdf55140a8f34.jpg', 
      alt: 'Inglés',
      route: '/ingles'
    },
    { 
      url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJkZj1jza_8hShQ_q0Ar_l6zIkoIxab0nxGg&s', 
      alt: 'Ciencias',
      route: '/ciencia'
    }
  ];

  constructor(
    private storageService: StorageService,
    private router: Router,
    private platform: Platform,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {
    const userData = this.storageService.getItem('userData');
    if (userData) {
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
