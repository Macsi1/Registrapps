import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
})
export class RecuperarPage implements OnInit {
  email: string = '';
  claveAntigua: string = '';
  claveNueva: string = '';
  confirmarClave: string = '';
  correoValido: boolean = false;
  claveAntiguaValida: boolean = false;
  clavesCoinciden: boolean = false;
  usuarios: any[] = [];
  mostrarToast: boolean = false;

  constructor(
    private dataService: DataService,
    private router: Router,
    private alertController: AlertController
  ) { }

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.dataService.getUsuarios().subscribe(data => {
      this.usuarios = data.usuarios;
    });
  }

  validarCorreo(event: any) {
    const correo = event.target.value;
    this.correoValido = this.usuarios.some(usuario => usuario.correo === correo);
    this.email = correo;
  }

  validarClaveAntigua() {
    const usuario = this.usuarios.find(u => u.correo === this.email);
    this.claveAntiguaValida = usuario && usuario.clave === this.claveAntigua;
  }

  validarClaves() {
    this.clavesCoinciden = this.claveNueva === this.confirmarClave && this.claveNueva.length > 0;
  }

  async cambiarContrasena() {
    if (!this.correoValido || !this.claveAntiguaValida || !this.clavesCoinciden) {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor verifica todos los campos',
        buttons: ['OK']
      });
      await alert.present();
      return;
    }

    const usuario = this.usuarios.find(u => u.correo === this.email);
    if (usuario) {
      const usuarioActualizado = { ...usuario, clave: this.claveNueva };
      
      this.dataService.actualizarUsuario(usuarioActualizado).subscribe(
        async () => {
          this.mostrarToast = true;
          setTimeout(() => {
            this.mostrarToast = false;
            this.router.navigate(['/tres']);
          }, 2000);
        },
        async (error) => {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'No se pudo actualizar la contraseña',
            buttons: ['OK']
          });
          await alert.present();
        }
      );
    }
  }
}
