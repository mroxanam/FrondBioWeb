import { CommonModule } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { FacturaComponent } from './factura.component';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('FacturaComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule,FacturaComponent,HttpClientTestingModule], // Importa el standalone component aquí
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(FacturaComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});