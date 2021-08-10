import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegateComponent } from './components/delegate/delegate.component';
import { DelegationLeaderComponent } from './components/delegation-leader/delegation-leader.component';
import { LoginComponent } from './components/login/login.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RegisterComponent } from './components/register/register.component';
import { UnregisteredComponent } from './components/unregistered/unregistered.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'organizer', component: OrganizerComponent},
  {path: 'delegate', component: DelegateComponent},
  {path: 'leader', component: DelegationLeaderComponent},
  {path: 'unregistered', component: UnregisteredComponent},
  {path: 'password-reset', component: PasswordResetComponent},
  {path: 'register', component: RegisterComponent},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
