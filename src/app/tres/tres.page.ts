import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-tres',
  templateUrl: './tres.page.html',
  styleUrls: ['./tres.page.scss'],
})

export class TresPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  // Credenciales válidas
  validCredentials = [
    { email: 'invitado@gmail.com', password: '12345678' },
    { email: 'profesor@gmail.com', password: '12345678' }
  ];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService
  ) { }

  ngOnInit() {}

  // Función de inicio de sesión actualizada
  async login() {
    const isValidUser = this.validCredentials.some(
      cred => cred.email === this.email && cred.password === this.password
    );

    if (isValidUser) {
      this.storageService.setItem('isAuthenticated', true);
      this.router.navigate(['/home']);
    } else {
      await this.mostrarAlertaError();
    }
  }

  async mostrarAlertaError() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Credenciales inválidas. Por favor, verifique su correo y contraseña.',
      buttons: ['OK']
    });

    await alert.present();
  }

  ionViewWillEnter() {
    this.storageService.removeItem('isAuthenticated');
  }
}
