import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForumComponent } from './forum.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from '../servicios/auth.service';
import { Pregunta } from './forum.component';

describe('ForumComponent', () => {
  let component: ForumComponent;
  let fixture: ComponentFixture<ForumComponent>;
  let authServiceMock: any;
  let routerMock: any;

  beforeEach(async () => {
    // Mock de AuthService
    authServiceMock = {
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({ username: 'TestUser' })
    };

    // Mock de Router
    routerMock = {
      navigate: jasmine.createSpy('navigate')
    };

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, CommonModule, HttpClientTestingModule,ForumComponent],
      
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize currentUser from AuthService', () => {
    expect(authServiceMock.getUserInfo).toHaveBeenCalled();
    expect(component.currentUser).toBe('TestUser');
  });

  it('should have an empty formulario initially', () => {
    expect(component.formulario.valid).toBeFalse();
    expect(component.formulario.get('titulo')?.value).toBe('');
    expect(component.formulario.get('pregunta')?.value).toBe('');
  });

  it('should add a question when enviarPregunta is called', () => {
    component.formulario.setValue({ titulo: 'Test Title', pregunta: 'Test Question' });
    component.enviarPregunta();
    expect(component.preguntas.length).toBe(1);
    expect(component.preguntas[0].titulo).toBe('Test Title');
    expect(component.preguntas[0].pregunta).toBe('Test Question');
  });

  it('should not add a question if formulario is invalid', () => {
    component.formulario.setValue({ titulo: '', pregunta: '' });
    component.enviarPregunta();
    expect(component.preguntas.length).toBe(0);
  });

  it('should add a response when enviarRespuesta is called', () => {
    const pregunta: Pregunta = {
      titulo: 'Test Title',
      pregunta: 'Test Question',
      respuestas: [],
      usuario: 'TestUser'
    };

    component.preguntas.push(pregunta);
    component.formularioRespuesta.setValue({ respuesta: 'Test Response' });
    component.enviarRespuesta(pregunta);

    expect(pregunta.respuestas.length).toBe(1);
    expect(pregunta.respuestas[0].respuesta).toBe('Test Response');
    expect(pregunta.respuestas[0].usuario).toBe('TestUser');
  });

  it('should not add a response if formularioRespuesta is invalid', () => {
    const pregunta: Pregunta = {
      titulo: 'Test Title',
      pregunta: 'Test Question',
      respuestas: [],
      usuario: 'TestUser'
    };

    component.preguntas.push(pregunta);

    // Intentamos agregar una respuesta con un formulario vacío
    component.formularioRespuesta.setValue({ respuesta: '' }); // Formulario inválido
    component.enviarRespuesta(pregunta);

    // Verificamos que no se agregó ninguna respuesta
    expect(pregunta.respuestas.length).toBe(0);
  });

  it('should navigate back when volverAtras is called', () => {
    component.volverAtras();
    expect(routerMock.navigate).toHaveBeenCalledWith(['../']);
  });
});
