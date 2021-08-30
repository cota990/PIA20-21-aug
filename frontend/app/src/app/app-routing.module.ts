import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegateComponent } from './components/delegate/delegate.component';
import { DelegationLeaderComponent } from './components/delegation-leader/delegation-leader.component';
import { LoginComponent } from './components/login/login.component';
import { UnregisteredMenuComponent } from './components/menu/unregistered-menu/unregistered-menu.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RegisterComponent } from './components/register/register.component';
import { CountriesComponent } from './components/unregistered/countries/countries.component';
import { MedalsCountComponent } from './components/unregistered/medals-count/medals-count.component';
import { MedalsVisualizationComponent } from './components/unregistered/medals-visualization/medals-visualization.component';
import { ParticipantsComponent } from './components/unregistered/participants/participants.component';
import { UnregisteredComponent } from './components/unregistered/unregistered.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'organizer', component: OrganizerComponent},
  {path: 'delegate', component: DelegateComponent},
  {path: 'leader', component: DelegationLeaderComponent},
  // header menu routes

  // unregistered routes and paths
  {
    path: 'unregistered', 
    component: UnregisteredComponent,
    children: [
      {
        path: '',
        component: CountriesComponent
      },
      {
        path: 'countries',
        component: CountriesComponent
      },
      {
        path: 'medalsCount',
        component: MedalsCountComponent
      },
      {
        path: 'medalsVisualization',
        component: MedalsVisualizationComponent
      },
      {
        path: 'participants',
        component: ParticipantsComponent
      }
    ]
  },
  {path: 'password-reset', component: PasswordResetComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'unregistered', component: UnregisteredMenuComponent, outlet: 'menu'},
  {path: 'countries', component: CountriesComponent, outlet: 'unregistered'},
  {path: '**', component: LoginComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
