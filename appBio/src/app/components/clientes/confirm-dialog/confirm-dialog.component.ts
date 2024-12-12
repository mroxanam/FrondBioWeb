import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Confirmar</h2>
    <div mat-dialog-content>
      {{ data.message }}
    </div>
    <div mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">Cancelar</button>
      <button mat-button color="warn" (click)="dialogRef.close(true)">Confirmar</button>
    </div>
  `,
  styles: [`
    mat-dialog-actions {
      justify-content: flex-end;
      gap: 8px;
    }
  `]
})
export class ConfirmDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
