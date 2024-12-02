import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DashBoardComponent } from './Dash/dash-board/dash-board.component';
import { HomePageComponent } from './shared/home-page/home-page.component';
import { RegistroComponent } from './registro/registro.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { RoleGuard } from './guards/role.guard';
import { AuthGuard } from './guards/auth.guard';
import { QuienesSOmos01Component } from './QuienesSomos/quienes-somos01/quienes-somos01.component';

// Exportamos las rutas
export const routes: Routes = [
  { 
    path: '', 
    component: HomePageComponent 
  },
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'registro', 
    component: RegistroComponent 
  },
  { 
    path: 'dash', 
    component: DashBoardComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'users',
        loadChildren: () => import('./users/users.module').then(m => m.UsersModule),
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'Administracion'] }
      },
      {
        path: 'settings',
        loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
        canActivate: [RoleGuard],
        data: { roles: ['Administracion'] }
      },
      {
        path: 'reports',
        loadChildren: () => import('./reports/reports.module').then(m => m.ReportsModule),
        canActivate: [RoleGuard],
        data: { roles: ['Manager', 'Administracion', 'Tecnico'] }
      }
    ]
  },
  { 
    path: 'quienes-somos', 
    component: QuienesSOmos01Component 
  },
  { 
    path: 'unauthorized', 
    component: UnauthorizedComponent 
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  // Configura el router
  exports: [RouterModule]
})
export class AppRoutingModule { }
