import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { DelegateComponent } from './components/delegate/delegate.component';
import { DelegationLeaderComponent } from './components/delegation-leader/delegation-leader.component';
import { UnregisteredComponent } from './components/unregistered/unregistered.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { RegisterComponent } from './components/register/register.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    OrganizerComponent,
    DelegateComponent,
    DelegationLeaderComponent,
    UnregisteredComponent,
    HeaderComponent,
    FooterComponent,
    RegisterComponent,
    PasswordResetComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
