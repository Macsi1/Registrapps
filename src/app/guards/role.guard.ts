import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(
    private storageService: StorageService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const userData = this.storageService.getItem('userData');
    if (userData?.rol === 'profesor') {
      return true;
    }
    this.router.navigate(['/home']);
    return false;
  }
} 