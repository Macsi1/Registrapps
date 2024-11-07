import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private usuarios: any[] = [];

  constructor(private http: HttpClient) { }

  getUsuarios(): Observable<any> {
    return this.http.get('assets/data.json');
  }

  actualizarUsuario(usuarioActualizado: any): Observable<any> {
    // Actualiza el usuario en la memoria local
    this.usuarios = this.usuarios.map(usuario => 
      usuario.correo === usuarioActualizado.correo ? usuarioActualizado : usuario
    );
    
    // Simula una respuesta exitosa
    return of({ success: true, usuario: usuarioActualizado });
  }
} 