import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dos',
  templateUrl: './dos.page.html',
  styleUrls: ['./dos.page.scss'],
})
export class DosPage implements OnInit {
  email: string = '';
  correoValido: boolean = false;
  mostrarToast = false;

  constructor() { }

  ngOnInit() {
  }

  validarCorreo(event: any) {
    const correoPermitido = 'invitado@gmail.com';
    this.correoValido = event.target.value === correoPermitido;
  }

  enviarEnlace() {
    if (this.correoValido) {
      // Lógica para enviar el enlace
      console.log('Enlace enviado a', this.email);
      this.mostrarToast = true;
    }
  }
}
