import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

interface ActualizarCredencialesResponse {
  mensaje: string;
  success: boolean;
}

@Component({
  selector: 'app-cambiar-credenciales',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './cambiar-credenciales.component.html',
  styleUrls: ['./cambiar-credenciales.component.css']
})
export class CambiarCredencialesComponent implements OnInit {
  credencialesForm: FormGroup;
  error: string = '';
  success: string = '';
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private dialogRef: MatDialogRef<CambiarCredencialesComponent>,
    private router: Router
  ) {
    this.credencialesForm = this.fb.group({
      nuevoUsername: new FormControl('', {
        validators: [Validators.required, Validators.minLength(4)],
        updateOn: 'change'
      }),
      nuevaPassword: new FormControl('', {
        validators: [Validators.required, Validators.minLength(6)],
        updateOn: 'change'
      }),
      passwordActual: new FormControl('', {
        validators: [Validators.required],
        updateOn: 'change'
      })
    });
  }

  ngOnInit(): void {
    // Verificar autenticación al iniciar
    const userInfo = this.authService.getUserInfo();
    if (!userInfo.username || !userInfo.rol) {
      this.error = 'No hay sesión activa';
      this.router.navigate(['/login']);
      return;
    }

    // Pre-llenar el username actual
    this.credencialesForm.patchValue({
      nuevoUsername: userInfo.username
    });
  }

  setLoading(loading: boolean) {
    this.loading = loading;
    if (loading) {
      this.credencialesForm.disable();
    } else {
      this.credencialesForm.enable();
    }
  }

  onSubmit() {
    if (this.credencialesForm.valid) {
      const userInfo = this.authService.getUserInfo();
      if (!userInfo.username || !userInfo.rol) {
        this.error = 'La sesión ha expirado. Por favor, inicia sesión nuevamente.';
        this.success = '';
        return;
      }

      this.setLoading(true);
      this.error = '';
      this.success = '';
      
      const credenciales = {
        nuevoUsername: this.credencialesForm.get('nuevoUsername')?.value,
        nuevaPassword: this.credencialesForm.get('nuevaPassword')?.value,
        passwordActual: this.credencialesForm.get('passwordActual')?.value
      };

      this.authService.actualizarCredenciales(credenciales).subscribe({
        next: (response: ActualizarCredencialesResponse) => {
          console.log('Respuesta del servidor:', response);
          
          // Limpiar cualquier error previo
          this.error = '';
          
          // Establecer mensaje de éxito
          if (typeof response === 'string') {
            this.success = response;
          } else {
            this.success = response.mensaje || 'Credenciales actualizadas correctamente';
          }

          // Actualizar localStorage
          localStorage.setItem('userInfo', JSON.stringify({
            username: credenciales.nuevoUsername,
            rol: userInfo.rol
          }));
          
          // Cerrar el diálogo después de un momento
          setTimeout(() => {
            this.dialogRef.close({
              success: true,
              username: credenciales.nuevoUsername,
              rol: userInfo.rol
            });
            window.location.reload();
          }, 1500);
          
          this.setLoading(false);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error del servidor:', error);
          
          // Limpiar mensaje de éxito
          this.success = '';
          
          // Establecer mensaje de error
          if (error.status === 401) {
            this.error = 'La sesión ha expirado. Por favor, inicia sesión nuevamente.';
          } else if (error.status === 405) {
            this.error = 'Error en el método de actualización. Por favor, contacte al administrador.';
          } else if (error.status === 400) {
            this.error = error.error?.mensaje || 'Datos inválidos. Por favor, verifique la información.';
          } else {
            this.error = 'Error al actualizar las credenciales. Por favor, intente nuevamente.';
          }
          
          this.setLoading(false);
        }
      });
    } else {
      this.error = 'Por favor, complete todos los campos correctamente';
      this.success = '';
    }
  }

  cerrar() {
    this.dialogRef.close();
  }
}
