import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { StorageService } from '../services/storage.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-tres',
  templateUrl: './tres.page.html',
  styleUrls: ['./tres.page.scss'],
})

export class TresPage implements OnInit {
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  usuarios: any[] = [];

  constructor(
    private router: Router,
    private alertController: AlertController,
    private storageService: StorageService,
    private dataService: DataService
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.dataService.getUsuarios().subscribe(data => {
      this.usuarios = data.usuarios;
    });
  }

  async login() {
    const isValidUser = this.usuarios.some(
      usuario => usuario.correo === this.email && usuario.clave === this.password
    );

    if (isValidUser) {
      const usuario = this.usuarios.find(u => u.correo === this.email);
      this.storageService.setItem('isAuthenticated', true);
      this.storageService.setItem('userData', usuario);
      try {
        await this.router.navigate(['/home']);
      } catch (error) {
        console.error('Error durante el inicio de sesión:', error);
      }
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
    this.storageService.removeItem('userData');
  }
}
