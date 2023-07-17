import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { PersonManagementComponent } from './persons/person-management.component';

@NgModule({
  declarations: [
    AppComponent,
    //Declaration of the newly created Component PersonManagement so the application knows it and we can use it
    PersonManagementComponent
  ],
  exports: [],
  imports: [
    BrowserModule,
    //These two Modules are imported here to be usable in the application
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
