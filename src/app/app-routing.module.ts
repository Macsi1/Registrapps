import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'tres',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'tres',
    loadChildren: () => import('./tres/tres.module').then( m => m.TresPageModule)
  },
  {
    path: 'mate',
    loadChildren: () => import('./mate/mate.module').then( m => m.MatePageModule)
  },
  {
    path: 'lengua',
    loadChildren: () => import('./lengua/lengua.module').then( m => m.LenguaPageModule)
  },
  {
    path: 'historia',
    loadChildren: () => import('./historia/historia.module').then( m => m.HistoriaPageModule)
  },
  {
    path: 'ciencia',
    loadChildren: () => import('./ciencia/ciencia.module').then( m => m.CienciaPageModule)
  },
  {
    path: 'ingles',
    loadChildren: () => import('./ingles/ingles.module').then( m => m.InglesPageModule)
  },
  {
    path: 'asistencia',
    loadChildren: () => import('./asistencia/asistencia.module').then( m => m.AsistenciaPageModule)
  },
  {
    path: 'generar',
    loadChildren: () => import('./generar/generar.module').then( m => m.GenerarPageModule),
    canActivate: [RoleGuard]
  },
  {
    path: 'escanear',
    loadChildren: () => import('./escanear/escanear.module').then( m => m.EscanearPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'dos',
    loadChildren: () => import('./dos/dos.module').then(m => m.DosPageModule)
  }
  

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
