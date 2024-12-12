import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTable, MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { UsuariosRegistradosService, UsuarioRegistrado } from '../../services/usuarios-registrados.service';
import { ConfirmDialogComponent } from '../clientes/confirm-dialog/confirm-dialog.component';
import { FotoPerfilComponent } from '../foto-perfil/foto-perfil.component';

@Component({
  selector: 'app-usuarios-registrados',
  templateUrl: './usuarios-registrados.component.html',
  styleUrls: ['./usuarios-registrados.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    ConfirmDialogComponent,
    FotoPerfilComponent
  ]
})
export class UsuariosRegistradosComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<UsuarioRegistrado>;

  dataSource: MatTableDataSource<UsuarioRegistrado>;
  displayedColumns: string[] = ['username', 'email', 'dni', 'rol', 'acciones'];
  loading = true;
  error = '';
  usuarioActual: UsuarioRegistrado | null = null;

  constructor(
    private usuariosService: UsuariosRegistradosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<UsuarioRegistrado>();
  }

  ngOnInit() {
    this.cargarUsuarioActual();
    this.cargarUsuarios();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarUsuarioActual() {
    this.usuariosService.getUsuarioActual().subscribe({
      next: (usuario) => {
        this.usuarioActual = usuario;
      },
      error: (error) => {
        console.error('Error al cargar usuario actual:', error);
        this.mostrarMensaje('Error al cargar usuario actual', 'error');
      }
    });
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuariosService.getUsuarios().subscribe({
      next: (usuarios) => {
        this.dataSource.data = usuarios;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
        this.error = 'Error al cargar los usuarios';
        this.loading = false;
        this.mostrarMensaje('Error al cargar los usuarios', 'error');
      }
    });
  }

  buscarPorDni(dni: number) {
    this.loading = true;
    this.usuariosService.getUsuarioByDni(dni).subscribe({
      next: (usuario) => {
        this.dataSource.data = [usuario];
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al buscar usuario:', error);
        this.loading = false;
        this.mostrarMensaje('Error al buscar usuario por DNI', 'error');
      }
    });
  }

  editarUsuario(usuario: UsuarioRegistrado) {
    // Aquí implementaremos la lógica de edición más adelante
    // Por ahora solo mostramos un mensaje
    this.mostrarMensaje('Funcionalidad de edición en desarrollo');
  }

  eliminarUsuario(usuario: UsuarioRegistrado) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { 
        title: 'Confirmar eliminación',
        message: `¿Está seguro de eliminar al usuario ${usuario.username}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuariosService.deleteUsuario(usuario.id).subscribe({
          next: () => {
            this.cargarUsuarios();
            this.mostrarMensaje('Usuario eliminado con éxito');
          },
          error: (error) => {
            console.error('Error al eliminar usuario:', error);
            this.mostrarMensaje('Error al eliminar el usuario', 'error');
          }
        });
      }
    });
  }

  aplicarFiltro(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  mostrarMensaje(mensaje: string, tipo: 'error' | 'success' = 'success') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 3000,
      panelClass: tipo === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  limpiarBusqueda() {
    this.cargarUsuarios();
  }
}
