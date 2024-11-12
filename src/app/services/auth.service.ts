import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor() {}

  getCurrentUserId(): string {
    // Implementa la lógica para obtener el ID del usuario actual
    return '';
  }
} 