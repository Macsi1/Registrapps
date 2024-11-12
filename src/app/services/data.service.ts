import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly USERS_KEY = 'usuarios';

  constructor(private http: HttpClient) {
    // Inicializar localStorage con datos del JSON si está vacío
    if (!localStorage.getItem(this.USERS_KEY)) {
      this.getUsuarios().subscribe(data => {
        localStorage.setItem(this.USERS_KEY, JSON.stringify(data.usuarios));
      });
    }
  }

  getUsuarios() {
    const usuariosStorage = localStorage.getItem(this.USERS_KEY);
    if (usuariosStorage) {
      return of({ usuarios: JSON.parse(usuariosStorage) });
    }
    return this.http.get<any>('assets/data.json');
  }

  actualizarUsuario(usuario: any) {
    const usuarios = JSON.parse(localStorage.getItem(this.USERS_KEY) || '[]');
    const index = usuarios.findIndex((u: any) => u.id === usuario.id);
    if (index !== -1) {
      usuarios[index] = usuario;
      localStorage.setItem(this.USERS_KEY, JSON.stringify(usuarios));
    }
    return of(usuario);
  }
} 