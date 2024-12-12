import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { ClienteDto } from '../../../models/cliente.interface';

@Component({
  selector: 'app-cliente-detalles',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title>Detalles del Cliente</h2>
    <mat-dialog-content>
      <div class="detalles-container">
        <mat-card>
          <mat-card-content>
            <div class="info-section">
              <h3>Información Personal</h3>
              <p><strong>Número de Cliente:</strong> {{ data.numeroCliente }}</p>
              <p><strong>DNI:</strong> {{ data.dni }}</p>
              <p><strong>Nombre:</strong> {{ data.nombre }} {{ data.apellido }}</p>
              <p><strong>Email:</strong> {{ data.email }}</p>
            </div>

            <mat-divider *ngIf="data.domicilios?.length"></mat-divider>

            <div class="info-section" *ngIf="data.domicilios?.length">
              <h3>Domicilios</h3>
              <mat-list>
                <mat-list-item *ngFor="let domicilio of data.domicilios">
                  <mat-icon matListItemIcon>home</mat-icon>
                  <div matListItemTitle>{{ domicilio.calle }} {{ domicilio.numero }}</div>
                  <div matListItemLine>
                    Medidor: {{ domicilio.numeroMedidor }}
                    <span *ngIf="domicilio.piso || domicilio.departamento">
                      - Piso: {{ domicilio.piso }} Depto: {{ domicilio.departamento }}
                    </span>
                  </div>
                </mat-list-item>
              </mat-list>
            </div>

            <mat-divider *ngIf="data.facturas?.length"></mat-divider>

            <div class="info-section" *ngIf="data.facturas?.length">
              <h3>Últimas Facturas</h3>
              <mat-list>
                <mat-list-item *ngFor="let factura of data.facturas">
                  <mat-icon matListItemIcon>receipt</mat-icon>
                  <div matListItemTitle>Factura #{{ factura.numeroFactura }}</div>
                  <div matListItemLine>
                    Emisión: {{ factura.fechaEmision | date:'dd/MM/yyyy' }}
                    - Vencimiento: {{ factura.fechaVencimiento | date:'dd/MM/yyyy' }}
                  </div>
                  <div matListItemLine>
                    Consumo Mensual: {{ factura.consumoMensual }} m³
                    - Total: {{ factura.consumoTotal }} m³
                  </div>
                </mat-list-item>
              </mat-list>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="cerrar()">Cerrar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .detalles-container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    .info-section {
      margin: 20px 0;
    }
    mat-divider {
      margin: 20px 0;
    }
    h3 {
      color: #666;
      margin-bottom: 15px;
    }
    .mat-mdc-list-item {
      margin-bottom: 10px;
    }
  `]
})
export class ClienteDetallesComponent {
  constructor(
    public dialogRef: MatDialogRef<ClienteDetallesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ClienteDto
  ) {}

  cerrar(): void {
    this.dialogRef.close();
  }
}
