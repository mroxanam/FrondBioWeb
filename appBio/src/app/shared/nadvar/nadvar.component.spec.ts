import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NadvarComponent } from './nadvar.component';
import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing'; 

describe('NadvarComponent', () => {
  let component: NadvarComponent;
  let fixture: ComponentFixture<NadvarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,
         CommonModule, NadvarComponent,RouterTestingModule] // NadvarComponent se debe agregar aquí
    })
    .compileComponents();

    fixture = TestBed.createComponent(NadvarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
