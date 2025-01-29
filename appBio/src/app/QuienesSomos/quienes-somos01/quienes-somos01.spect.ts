import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuienesSOmos01Component } from './quienes-somos01.component';
import { CommonModule } from '@angular/common'; // Importa los módulos necesarios

describe('QuienesSomos01Component', () => {
  let component: QuienesSOmos01Component;
  let fixture: ComponentFixture<QuienesSOmos01Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, QuienesSOmos01Component] // Incluye los módulos necesarios
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuienesSOmos01Component);
    component = fixture.componentInstance;
    fixture.detectChanges(); // Detecta los cambios iniciales
  });

  it('should create', () => {
    expect(component).toBeTruthy(); // Verifica que el componente se haya creado correctamente
  });
});
