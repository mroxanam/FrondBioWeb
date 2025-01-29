import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-historial-de-pagos',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule    
  ],
  templateUrl: './historialDePagos.component.html',
  styleUrls: ['./historialDePagos.component.css']
})
export class HistorialDePagosComponent implements OnInit {
  // Controles de filtro
  fechaSeleccionada = new FormControl('');
  estadoSeleccionado = new FormControl('');

  // Datos de pagos
  pagos: any[] = [];
  pagosFiltrados: any[] = [];
  displayedColumns: string[] = ['id', 'estado'];

  ngOnInit(): void {
    // Simulación de carga de datos
    this.pagos = [
      { id: 1, estado: 'Procesado', fecha: '2023-01-15' },
      { id: 2, estado: 'Pendiente', fecha: '2023-01-16' },
      { id: 3, estado: 'Fallido', fecha: '2023-01-17' }
    ];
    // Inicializar con todos los pagos
    this.pagosFiltrados = [...this.pagos];
  }

  filtrarPagos(): void {
    const estado = this.estadoSeleccionado.value?.trim().toLowerCase();
    const fecha = this.fechaSeleccionada.value?.trim();

    // Aplicar filtros
    this.pagosFiltrados = this.pagos.filter(pago => {
      const coincideEstado = estado ? pago.estado.toLowerCase() === estado : true;
      const coincideFecha = fecha ? pago.fecha === fecha : true;
      return coincideEstado && coincideFecha;
    });
  }

  obtenerTodos(): void {
    // Restablecer la lista de pagos filtrados a todos los pagos
    this.pagosFiltrados = [...this.pagos];
    // Limpiar los controles de filtro
    this.fechaSeleccionada.setValue('');
    this.estadoSeleccionado.setValue('');
  }
}
