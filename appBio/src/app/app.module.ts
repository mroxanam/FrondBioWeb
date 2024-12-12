import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ClientesComponent } from './components/clientes/clientes.component';
import { ClienteDialogComponent } from './components/clientes/cliente-dialog/cliente-dialog.component';
import { ConfirmDialogComponent } from './components/clientes/confirm-dialog/confirm-dialog.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ClientesComponent,
    ClienteDialogComponent,
    ConfirmDialogComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
