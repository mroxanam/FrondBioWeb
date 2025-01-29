import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { FacturaService } from '../services/facturaService';
import { ClienteDto } from '../models/cliente.interface';
import { FacturaDto } from '../models/factura.interface';
import { ConfirmDialogComponent } from '../components/clientes/confirm-dialog/confirm-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-factura',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatDialogModule,
    DatePipe,
  ],
  providers: [DatePipe],
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.css'],
})
export class FacturaComponent implements OnInit {
  clienteSeleccionado: ClienteDto | null = null;
  facturas: FacturaDto[] = [];
  clientes: ClienteDto[] = []; // Para llenar la tabla de clientes
  facturaSeleccionada: FacturaDto | null = null;
  creandoFactura = false;

  formFactura: FormGroup;

  displayedColumnsClientes: string[] = ['dni', 'nombre', 'apellido', 'email', 'acciones'];
  displayedColumnsFacturas: string[] = [
    'numeroFactura',
    'numeroCliente',
    'fechaEmision',
    'fechaVencimiento',
    'consumoMensual',
    'consumoTotal',
    'acciones',
  ];

  constructor(
    private facturaService: FacturaService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.formFactura = this.fb.group({
      numeroCliente: ['', Validators.required],
      fechaEmision: ['', Validators.required],
      fechaVencimiento: ['', Validators.required],
      consumoMensual: ['', [Validators.required, Validators.min(1)]],
      consumoTotal: ['', [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    this.cargarClientes();
  }

  cargarClientes(): void {
    // Simulamos la carga de clientes desde un servicio
    this.facturaService.getClientes().subscribe({
      next: (clientes) => (this.clientes = clientes),
      error: () => this.mostrarSnackBar('Error al cargar clientes.'),
    });
  }

  onClienteSeleccionado(cliente: ClienteDto): void {
    this.clienteSeleccionado = cliente;
    this.cargarFacturas(cliente.dni);
  }

  cargarFacturas(dni: number): void {
    this.facturaService.getFacturasByDni(dni).subscribe({
      next: (facturas) => {
        console.log('Facturas obtenidas:', facturas);
        
        (this.facturas = facturas);
      },
      error: (err) => {
        console.error('Error al cargar facturas:', err);
        this.mostrarSnackBar('Error al cargar facturas.');
      },
    
    });
  }

  nuevaFactura(): void {
    this.creandoFactura = true;
    this.formFactura.reset();
    this.facturaSeleccionada = null;
  }
  cancelarEdicion(): void {
    this.creandoFactura = false;
    this.formFactura.reset();
    this.facturaSeleccionada = null;
  }

  guardarFactura(): void {
    if (this.formFactura.valid) {
      const factura: FacturaDto = {
        ...this.facturaSeleccionada, // Mantener el número de factura si es edición
        ...this.formFactura.value,  // Actualizar con los valores del formulario
      };
  
      this.facturaService.crearOActualizarFactura(factura).subscribe({
        next: () => {
          this.mostrarSnackBar('Factura guardada correctamente.');
          this.creandoFactura = false;
          if (this.clienteSeleccionado?.dni) {
            this.cargarFacturas(this.clienteSeleccionado.dni);
          }
        },
        error: () => this.mostrarSnackBar('Error al guardar la factura.'),
      });
    } else {
      this.mostrarSnackBar('Complete todos los campos correctamente.');
    }
  }
  
  

  
  

  eliminarFactura(factura: FacturaDto): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { mensaje: `¿Está seguro de eliminar la factura ${factura.numeroFactura}?` },
    });

    dialogRef.afterClosed().subscribe((confirmado) => {
      if (confirmado) {
        this.facturaService.eliminarFactura(Number(factura.numeroFactura)).subscribe({
          next: () => {
            this.mostrarSnackBar('Factura eliminada correctamente.');
            if (this.clienteSeleccionado?.dni) {
              this.cargarFacturas(this.clienteSeleccionado.dni);
            }
          },
          error: () => this.mostrarSnackBar('Error al eliminar la factura.'),
        });
      }
    });
  }

  imprimirFactura(factura: FacturaDto): void {
    const printContents = document.querySelector('.factura-container')?.innerHTML;
    if (printContents) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      if (printWindow) {
        printWindow.document.write(`
          <html>
          <head>
            <title>Imprimir Factura</title>
          </head>
          <body>${printContents}</body>
          </html>
        `);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }
    }
  }

  mostrarSnackBar(mensaje: string): void {
    this.snackBar.open(mensaje, 'Cerrar', { duration: 3000 });
  }

  seleccionarCliente(cliente: ClienteDto): void {
    this.onClienteSeleccionado(cliente);
  }

  confirmarSeleccionarFactura(factura: FacturaDto): void {
    this.facturaSeleccionada = factura;
  }

 

  confirmarEliminarFactura(factura: FacturaDto): void {
    this.eliminarFactura(factura);
  }

  volverAlInicio(): void {
    this.facturaSeleccionada = null;  // Restablecer la factura seleccionada
    this.clienteSeleccionado = null;  // Restablecer el cliente seleccionado
  }
  

}
