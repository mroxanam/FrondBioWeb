import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { ApiTestService } from '../../services/api-test.service';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-api-endpoints',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule
  ],
  template: `
    <div class="endpoints-container">
      <h2>Panel de Control de API</h2>
      
      <mat-accordion>
        <mat-expansion-panel *ngFor="let controller of controllers">
          <mat-expansion-panel-header>
            <mat-panel-title>
              {{controller.name}}
            </mat-panel-title>
          </mat-expansion-panel-header>

          <div class="endpoint-grid">
            <mat-card *ngFor="let endpoint of controller.endpoints" class="endpoint-card">
              <mat-card-header>
                <div [class]="'method-badge ' + endpoint.method.toLowerCase()">
                  {{endpoint.method}}
                </div>
                <mat-card-title>{{endpoint.path}}</mat-card-title>
              </mat-card-header>
              <mat-card-content>
                <p>{{endpoint.description}}</p>
                <div *ngIf="endpoint.showTestPanel" class="test-panel">
                  <mat-form-field *ngIf="endpoint.method !== 'GET' && endpoint.method !== 'DELETE'" appearance="fill" class="full-width">
                    <mat-label>Request Body (JSON)</mat-label>
                    <textarea matInput [(ngModel)]="endpoint.testBody" placeholder="{ }"></textarea>
                  </mat-form-field>
                  <div class="response-panel" *ngIf="endpoint.testResponse">
                    <h4>Respuesta:</h4>
                    <pre>{{endpoint.testResponse | json}}</pre>
                  </div>
                </div>
              </mat-card-content>
              <mat-card-actions>
                <button mat-button (click)="toggleTestPanel(endpoint)">
                  <mat-icon>{{endpoint.showTestPanel ? 'close' : 'code'}}</mat-icon>
                  {{endpoint.showTestPanel ? 'Cerrar' : 'Probar'}}
                </button>
                <button mat-button *ngIf="endpoint.showTestPanel" (click)="testEndpoint(endpoint)" color="primary">
                  <mat-icon>play_arrow</mat-icon>
                  Ejecutar
                </button>
              </mat-card-actions>
            </mat-card>
          </div>
        </mat-expansion-panel>
      </mat-accordion>
    </div>
  `,
  styles: [`
    .endpoints-container {
      padding: 20px;
      max-width: 1200px;
      margin: 0 auto;
    }

    h2 {
      color: #333;
      margin-bottom: 20px;
      font-size: 24px;
      font-weight: 500;
    }

    .endpoint-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-top: 15px;
    }

    .endpoint-card {
      margin-bottom: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .method-badge {
      padding: 4px 8px;
      border-radius: 4px;
      font-weight: bold;
      margin-right: 10px;
      color: white;
      min-width: 60px;
      text-align: center;
    }

    .get {
      background-color: #61affe;
    }

    .post {
      background-color: #49cc90;
    }

    .put {
      background-color: #fca130;
    }

    .delete {
      background-color: #f93e3e;
    }

    mat-card-actions {
      display: flex;
      justify-content: flex-end;
      padding: 8px;
    }

    .test-panel {
      margin-top: 15px;
      padding: 10px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }

    .full-width {
      width: 100%;
    }

    .response-panel {
      margin-top: 15px;
      padding: 10px;
      background-color: #fff;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .response-panel h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    pre {
      margin: 0;
      white-space: pre-wrap;
      word-wrap: break-word;
      background-color: #f8f8f8;
      padding: 10px;
      border-radius: 4px;
      font-size: 13px;
    }

    button mat-icon {
      margin-right: 4px;
    }
  `]
})
export class ApiEndpointsComponent implements OnInit {
  controllers = [
    {
      name: 'Autenticación',
      endpoints: [
        { 
          method: 'POST', 
          path: '/Auth/register', 
          description: 'Registrar nuevo usuario', 
          showTestPanel: false, 
          testBody: JSON.stringify({
            username: '',
            email: '',
            password: '',
            dni: 0
          }, null, 2),
          testResponse: null 
        },
        { 
          method: 'POST', 
          path: '/Auth/verificarDNI', 
          description: 'Verificar DNI de usuario', 
          showTestPanel: false, 
          testBody: JSON.stringify({
            dni: 0
          }, null, 2),
          testResponse: null 
        },
        { 
          method: 'POST', 
          path: '/Auth/login', 
          description: 'Iniciar sesión', 
          showTestPanel: false, 
          testBody: JSON.stringify({
            username: '',
            password: ''
          }, null, 2),
          testResponse: null 
        },
        { 
          method: 'POST', 
          path: '/Auth/logout', 
          description: 'Cerrar sesión', 
          showTestPanel: false, 
          testBody: '',
          testResponse: null 
        },
        { 
          method: 'PUT', 
          path: '/Auth/actualizar-credenciales', 
          description: 'Actualizar credenciales de usuario', 
          showTestPanel: false, 
          testBody: JSON.stringify({
            passwordActual: '',
            nuevoUsername: '',
            nuevaPassword: ''
          }, null, 2),
          testResponse: null 
        }
      ]
    },
    {
      name: 'Biodigestores',
      endpoints: [
        { method: 'GET', path: '/api/Biodigestores', description: 'Obtener todos los biodigestores', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'GET', path: '/api/Biodigestores/{id}', description: 'Obtener biodigestor por ID', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'POST', path: '/api/Biodigestores', description: 'Crear nuevo biodigestor', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'PUT', path: '/api/Biodigestores/{id}', description: 'Actualizar biodigestor', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'DELETE', path: '/api/Biodigestores/{id}', description: 'Eliminar biodigestor', showTestPanel: false, testBody: '', testResponse: null }
      ]
    },
    {
      name: 'Sensores',
      endpoints: [
        { method: 'GET', path: '/api/SensorHumedad', description: 'Obtener datos de humedad', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'GET', path: '/api/SensorPresion', description: 'Obtener datos de presión', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'GET', path: '/api/SensorTemperatura', description: 'Obtener datos de temperatura', showTestPanel: false, testBody: '', testResponse: null }
      ]
    },
    {
      name: 'Registros',
      endpoints: [
        { method: 'GET', path: '/api/Registros', description: 'Obtener todos los registros', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'POST', path: '/api/Registros', description: 'Crear nuevo registro', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'GET', path: '/api/Registros/{id}', description: 'Obtener registro por ID', showTestPanel: false, testBody: '', testResponse: null }
      ]
    },
    {
      name: 'Facturas',
      endpoints: [
        { method: 'GET', path: '/api/Factura', description: 'Obtener todas las facturas', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'POST', path: '/api/Factura', description: 'Crear nueva factura', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'GET', path: '/api/Factura/{id}', description: 'Obtener factura por ID', showTestPanel: false, testBody: '', testResponse: null }
      ]
    },
    {
      name: 'Control de Dispositivos',
      endpoints: [
        { method: 'GET', path: '/api/Agitador', description: 'Estado del agitador', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'GET', path: '/api/Calentadores', description: 'Estado de los calentadores', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'GET', path: '/api/ValvulaAgua', description: 'Estado de válvula de agua', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'GET', path: '/api/ValvulaPresion', description: 'Estado de válvula de presión', showTestPanel: false, testBody: '', testResponse: null }
      ]
    },
    {
      name: 'Simulador',
      endpoints: [
        { method: 'POST', path: '/api/SimuladorDeValores/temperatura', description: 'Simular temperatura', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'POST', path: '/api/SimuladorDeValores/presion', description: 'Simular presión', showTestPanel: false, testBody: '', testResponse: null },
        { method: 'POST', path: '/api/SimuladorDeValores/humedad', description: 'Simular humedad', showTestPanel: false, testBody: '', testResponse: null }
      ]
    },
    {
      name: 'Usuarios Registrados',
      endpoints: [
        { 
          method: 'GET', 
          path: '/api/UsuariosRegistrados/actual', 
          description: 'Obtener datos del usuario actual autenticado', 
          showTestPanel: false, 
          testBody: '', 
          testResponse: null 
        },
        { 
          method: 'GET', 
          path: '/api/UsuariosRegistrados', 
          description: 'Obtener todos los usuarios registrados (requiere rol Manager)', 
          showTestPanel: false, 
          testBody: '', 
          testResponse: null 
        },
        { 
          method: 'GET', 
          path: '/api/UsuariosRegistrados/{id}', 
          description: 'Obtener usuario por ID (requiere rol Manager)', 
          showTestPanel: false, 
          testBody: '', 
          testResponse: null 
        },
        { 
          method: 'GET', 
          path: '/api/UsuariosRegistrados/porDNI/{dni}', 
          description: 'Obtener usuario por DNI (requiere rol Manager)', 
          showTestPanel: false, 
          testBody: '', 
          testResponse: null 
        },
        { 
          method: 'PUT', 
          path: '/api/UsuariosRegistrados/{id}', 
          description: 'Actualizar usuario (requiere rol Manager)', 
          showTestPanel: false, 
          testBody: JSON.stringify({
            idUsuarioRegistrado: 0,
            username: '',
            email: '',
            dni: 0,
            rol: '',
            fotoPerfil: null,
            tipoContenidoFoto: null
          }, null, 2), 
          testResponse: null 
        },
        { 
          method: 'DELETE', 
          path: '/api/UsuariosRegistrados/{id}', 
          description: 'Eliminar usuario (requiere rol Manager)', 
          showTestPanel: false, 
          testBody: '', 
          testResponse: null 
        }
      ]
    }
  ];

  constructor(
    private apiTestService: ApiTestService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {}

  toggleTestPanel(endpoint: any) {
    endpoint.showTestPanel = !endpoint.showTestPanel;
    if (!endpoint.showTestPanel) {
      endpoint.testResponse = null;
    }
  }

  testEndpoint(endpoint: any) {
    let body;
    if (endpoint.testBody) {
      try {
        body = JSON.parse(endpoint.testBody);
      } catch (e) {
        this.snackBar.open('Error en el formato JSON del body', 'Cerrar', {
          duration: 3000
        });
        return;
      }
    }

    this.apiTestService.testEndpoint(endpoint.method, endpoint.path, body)
      .subscribe({
        next: (response) => {
          endpoint.testResponse = response;
          this.snackBar.open('Prueba exitosa', 'Cerrar', {
            duration: 3000
          });
        },
        error: (error) => {
          endpoint.testResponse = error;
          this.snackBar.open('Error en la prueba: ' + error.message, 'Cerrar', {
            duration: 3000
          });
        }
      });
  }
}
