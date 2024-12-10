import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cliente } from '../../../models/cliente.interface';

@Component({
  selector: 'app-cliente-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <h2 mat-dialog-title>{{ isEditing ? 'Editar Cliente' : 'Nuevo Cliente' }}</h2>
    <form [formGroup]="clienteForm" (ngSubmit)="onSubmit()">
      <mat-dialog-content>
        <!-- Solo mostrar numeroCliente en modo edición -->
        <mat-form-field *ngIf="isEditing" appearance="outline" class="full-width">
          <mat-label>Número de Cliente</mat-label>
          <input matInput formControlName="numeroCliente" readonly>
        </mat-form-field>

        <!-- DNI solo editable en modo creación -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>DNI</mat-label>
          <input matInput type="number" formControlName="dni" [readonly]="isEditing">
          <mat-error *ngIf="getErrorMessage('dni')">
            {{ getErrorMessage('dni') }}
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="nombre">
          <mat-error *ngIf="getErrorMessage('nombre')">
            {{ getErrorMessage('nombre') }}
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="apellido">
          <mat-error *ngIf="getErrorMessage('apellido')">
            {{ getErrorMessage('apellido') }}
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input matInput formControlName="email" type="email">
          <mat-error *ngIf="getErrorMessage('email')">
            {{ getErrorMessage('email') }}
          </mat-error>
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="onCancel()">Cancelar</button>
        <button mat-raised-button color="primary" type="submit" [disabled]="!clienteForm.valid">
          {{ isEditing ? 'Actualizar' : 'Crear' }}
        </button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 15px;
    }
    mat-dialog-content {
      min-width: 350px;
      padding: 20px 0;
    }
    mat-dialog-actions {
      padding: 20px 0;
    }
  `]
})
export class ClienteDialogComponent implements OnInit {
  isEditing = false;
  clienteForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ClienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Partial<Cliente>
  ) {
    this.isEditing = !!this.data && Object.keys(this.data).length > 0;
    console.log('Modo edición:', this.isEditing);
    console.log('Datos recibidos:', this.data);

    // Inicializar el formulario con campos diferentes según el modo
    if (this.isEditing) {
      // Modo edición: incluir numeroCliente
      this.clienteForm = this.formBuilder.group({
        numeroCliente: [{ value: this.data.numeroCliente, disabled: true }],
        dni: [{ value: this.data.dni, disabled: true }],
        nombre: [this.data.nombre, [Validators.required]],
        apellido: [this.data.apellido, [Validators.required]],
        email: [this.data.email, [Validators.required, Validators.email]]
      });
    } else {
      // Modo creación: no incluir numeroCliente
      this.clienteForm = this.formBuilder.group({
        dni: ['', [Validators.required]],
        nombre: ['', [Validators.required]],
        apellido: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]]
      });
    }
  }

  ngOnInit(): void {
    // La inicialización se hace en el constructor
  }

  onSubmit(): void {
    if (this.clienteForm.valid) {
      const formValue = this.clienteForm.getRawValue();
      console.log('Valores del formulario antes de enviar:', formValue);
      
      try {
        if (this.isEditing) {
          // Modo edición: incluir todos los campos
          const clienteActualizado = {
            numeroCliente: this.data.numeroCliente,
            dni: this.data.dni,
            nombre: formValue.nombre?.trim(),
            apellido: formValue.apellido?.trim(),
            email: formValue.email?.trim()
          };
          console.log('Datos actualizados a enviar:', clienteActualizado);
          this.dialogRef.close(clienteActualizado);
        } else {
          // Modo creación: no incluir numeroCliente
          const nuevoCliente = {
            dni: Number(formValue.dni),
            nombre: formValue.nombre?.trim(),
            apellido: formValue.apellido?.trim(),
            email: formValue.email?.trim()
          };
          console.log('Nuevo cliente a crear:', nuevoCliente);
          this.dialogRef.close(nuevoCliente);
        }
      } catch (error) {
        console.error('Error al procesar el formulario:', error);
        this.snackBar.open('Error al procesar los datos del formulario', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['error-snackbar']
        });
      }
    } else {
      this.snackBar.open('Por favor, complete todos los campos requeridos correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        panelClass: ['error-snackbar']
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getErrorMessage(controlName: string): string {
    const control = this.clienteForm.get(controlName);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('email')) {
      return 'El email no es válido';
    }
    return '';
  }
}
