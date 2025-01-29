import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RestablecerContrasenaComponent } from './restablecer-contrasena.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('RestablecerContrasenaComponent', () => {
  let component: RestablecerContrasenaComponent;
  let fixture: ComponentFixture<RestablecerContrasenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule,RestablecerContrasenaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RestablecerContrasenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
