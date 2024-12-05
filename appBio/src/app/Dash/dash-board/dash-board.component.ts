import { Component, OnInit, OnDestroy, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { MenuItem } from '../../models/menu-item.interface';
import { MENU_ITEMS } from '../../config/menu-items.config';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { CambiarCredencialesComponent } from '../../components/cambiar-credenciales/cambiar-credenciales.component';
import { FotoPerfilComponent } from '../../components/foto-perfil/foto-perfil.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dash-board',
  standalone: true,
  imports: [CommonModule, RouterModule, MatDialogModule, FotoPerfilComponent],
  templateUrl: './dash-board.component.html',
  styleUrls: ['./dash-board.component.css']
})
export class DashBoardComponent implements OnInit, OnDestroy {
  userRol: string | null = '';
  username: string | null = '';
  menuItems: MenuItem[] = [];
  private isBrowser: boolean;
  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  ngOnInit() {
    if (this.isBrowser) {
      // Verificar si hay sesión activa
      if (!this.authService.isAuthenticated()) {
        this.router.navigate(['/login']);
        return;
      }

      const userInfo = this.authService.getUserInfo();
      this.userRol = userInfo.rol || '';
      this.username = userInfo.username || '';
      console.log('UserInfo loaded:', { username: this.username, rol: this.userRol });

      // Filtrar elementos del menú según el rol
      this.updateMenuItems(this.userRol);

      // Suscribirse a cambios en el rol y username
      this.subscriptions.push(
        this.authService.userRole$.subscribe(rol => {
          console.log('Rol updated from service:', rol);
          this.userRol = rol;
          this.updateMenuItems(rol || '');
        })
      );

      this.subscriptions.push(
        this.authService.username$.subscribe(username => {
          console.log('Username updated from service:', username);
          this.username = username;
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  private updateMenuItems(userRol: string | null) {
    if (!userRol) {
      this.menuItems = [];
      return;
    }

    this.menuItems = MENU_ITEMS.filter(item => 
      item.roles.includes(userRol)
    ).map(item => ({
      ...item,
      active: this.router.url === item.route
    }));
  }

  setActiveMenuItem(route: string) {
    this.menuItems = this.menuItems.map(item => ({
      ...item,
      active: item.route === route
    }));
  }

  abrirModalCredenciales() {
    try {
      const dialogRef = this.dialog.open(CambiarCredencialesComponent, {
        width: '400px',
        disableClose: true
      });

      this.subscriptions.push(
        dialogRef.afterClosed().subscribe({
          next: (result) => {
            if (result) {
              console.log('Credenciales actualizadas con éxito');
            }
          },
          error: (error) => {
            console.error('Error al cerrar el diálogo:', error);
          }
        })
      );
    } catch (error) {
      console.error('Error al abrir el diálogo:', error);
    }
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout exitoso');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error en logout:', error);
        // Aún así, intentamos navegar al login
        this.router.navigate(['/login']);
      }
    });
  }
}
