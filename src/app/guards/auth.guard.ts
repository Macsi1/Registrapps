import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { StorageService } from '../services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  
  constructor(
    private router: Router,
    private storageService: StorageService
  ) {}

  canActivate(): boolean {
    const isAuthenticated = this.storageService.getItem('isAuthenticated');
    
    if (isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/tres']);
      return false;
    }
  }
} 