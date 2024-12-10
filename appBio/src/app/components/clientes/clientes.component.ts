import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTable, MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ClienteService } from '../../services/cliente.service';
import { Cliente } from '../../models/cliente.interface';
import { ClienteDialogComponent } from './cliente-dialog/cliente-dialog.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTooltipModule,
    ClienteDialogComponent,
    ConfirmDialogComponent
  ]
})
export class ClientesComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTable) table!: MatTable<Cliente>;

  clientes: Cliente[] = [];
  columnasMostradas: string[] = ['dni', 'nombre', 'apellido', 'email', 'acciones'];
  dataSource = new MatTableDataSource<Cliente>(this.clientes);

  constructor(
    private clienteService: ClienteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    console.log('Inicializando componente Clientes');
    this.cargarClientes();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  cargarClientes() {
    console.log('Intentando cargar clientes...');
    this.clienteService.getClientes().subscribe({
      next: (data) => {
        console.log('Clientes cargados:', data);
        this.clientes = data;
        this.dataSource = new MatTableDataSource(this.clientes);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (error) => {
        console.error('Error al cargar clientes:', error);
        const mensaje = error.message || 'Error al cargar los clientes';
        this.snackBar.open(mensaje, 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  agregarCliente() {
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Datos del nuevo cliente:', result);
        
        this.clienteService.createCliente(result).subscribe({
          next: () => {
            this.cargarClientes();
            this.snackBar.open('Cliente creado con éxito', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error al crear cliente:', error);
            const mensaje = error.message || 'Error al crear el cliente';
            this.snackBar.open(mensaje, 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  editarCliente(cliente: Cliente) {
    console.log('Cliente original a editar:', JSON.stringify(cliente));
    
    // Crear una copia del cliente para evitar modificar el original
    const clienteParaEditar = { ...cliente };
    
    const dialogRef = this.dialog.open(ClienteDialogComponent, {
      width: '400px',
      data: clienteParaEditar
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Asegurarse de mantener los valores originales que no se pueden cambiar
        const clienteActualizado: Cliente = {
          numeroCliente: cliente.numeroCliente,
          dni: cliente.dni,
          nombre: result.nombre?.trim(),
          apellido: result.apellido?.trim(),
          email: result.email?.trim()
        };
        
        console.log('Cliente original:', JSON.stringify(cliente));
        console.log('Resultado del diálogo:', JSON.stringify(result));
        console.log('Cliente actualizado:', JSON.stringify(clienteActualizado));
        
        // Verificar que los valores críticos no hayan cambiado
        if (clienteActualizado.dni !== cliente.dni) {
          this.snackBar.open(
            'Error: No se puede modificar el DNI', 
            'Cerrar', 
            { duration: 5000 }
          );
          return;
        }
        
        this.clienteService.updateCliente(cliente.dni, clienteActualizado).subscribe({
          next: () => {
            this.cargarClientes();
            this.snackBar.open('Cliente actualizado con éxito', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            console.error('Error completo al actualizar:', error);
            const mensaje = error.message || 'Error al actualizar el cliente';
            this.snackBar.open(mensaje, 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  eliminarCliente(cliente: Cliente) {
    const mensaje = `¿Está seguro que desea eliminar al cliente ${cliente.nombre} ${cliente.apellido}?`;
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: mensaje }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Asegurarse de que el dni sea un número
        const dni = Number(cliente.dni);
        this.clienteService.deleteCliente(dni).subscribe({
          next: () => {
            this.cargarClientes();
            this.snackBar.open('Cliente eliminado con éxito', 'Cerrar', {
              duration: 3000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom'
            });
          },
          error: (error) => {
            const mensaje = error.message || 'Error al eliminar el cliente';
            this.snackBar.open(mensaje, 'Cerrar', {
              duration: 5000,
              horizontalPosition: 'center',
              verticalPosition: 'bottom',
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
}
