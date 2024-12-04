import { Component, OnInit, inject } from '@angular/core';
import { FacturaService } from './factura.servicio';
import { CommonModule } from '@angular/common'; // Importar CommonModule para los pipes

@Component({
  selector: 'app-factura',
  standalone: true,
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
  imports: [CommonModule]  // Añadir CommonModule aquí
})
export class FacturaComponent implements OnInit {
  facturas: any[] = []; // Lista de facturas obtenidas del servicio
  facturaSeleccionada: any | null = null; // Factura seleccionada para ver detalles

  private facturaService = inject(FacturaService);

  ngOnInit(): void {
    // Cargar facturas al inicializar el componente
    this.cargarFacturas();
  }

  /**
   * Método para cargar todas las facturas desde el servicio.
   */
  cargarFacturas(): void {
    this.facturaService.obtenerFacturas().subscribe(
      (data) => {
        this.facturas = data;
        console.log('Facturas obtenidas correctamente:', this.facturas);
      },
      (error) => {
        console.error('Error al cargar facturas:', error);
        alert('Ocurrió un error al cargar las facturas. Inténtalo más tarde.');
      }
    );
  }

  /**
   * Método para seleccionar una factura específica por su número.
   * @param numeroFactura Número de la factura a seleccionar
   */
  seleccionarFactura(numeroFactura: number): void {
    this.facturaService.obtenerFactura(numeroFactura).subscribe(
      (factura) => {
        this.facturaSeleccionada = factura;
        console.log('Factura seleccionada:', this.facturaSeleccionada);
      },
      (error) => {
        console.error(`Error al cargar la factura con número ${numeroFactura}:`, error);
        alert(`No se pudo cargar la factura con número ${numeroFactura}. Inténtalo más tarde.`);
      }
    );
  }
}
