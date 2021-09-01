import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DelegateComponent } from './components/delegate/delegate.component';
import { DelegationLeaderComponent } from './components/delegation-leader/delegation-leader.component';
import { OverviewComponent } from './components/delegation-leader/overview/overview.component';
import { ParticipantComponent } from './components/delegation-leader/participant/participant.component';
import { TeamComponent } from './components/delegation-leader/team/team.component';
import { LoginComponent } from './components/login/login.component';
import { UnregisteredMenuComponent } from './components/menu/unregistered-menu/unregistered-menu.component';
import { CompetitionsComponent } from './components/organizer/competitions/competitions.component';
import { OrganizerComponent } from './components/organizer/organizer.component';
import { RecordsComponent } from './components/organizer/records/records.component';
import { RequestsComponent } from './components/organizer/requests/requests.component';
import { SportsComponent } from './components/organizer/sports/sports.component';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { RegisterComponent } from './components/register/register.component';
import { CountriesComponent } from './components/unregistered/countries/countries.component';
import { MedalsVisualizationComponent } from './components/unregistered/medals-visualization/medals-visualization.component';
import { ParticipantsComponent } from './components/unregistered/participants/participants.component';
import { UnregisteredComponent } from './components/unregistered/unregistered.component';

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'delegate', component: DelegateComponent},
  
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
        path: 'medalsVisualization',
        component: MedalsVisualizationComponent
      },
      {
        path: 'participants',
        component: ParticipantsComponent
      }
    ]
  },

  // organizer routes and paths
  {
    path: 'organizer', 
    component: OrganizerComponent,
    children: [
      {
        path: '',
        component: SportsComponent
      },
      {
        path: 'sports',
        component: SportsComponent
      },      
      {
        path: 'competitions',
        component: CompetitionsComponent
      },
      {
        path: 'requests',
        component: RequestsComponent
      },
      {
        path: 'records',
        component: RecordsComponent
      }
    ]
  },

  // national delegation leader routes and paths
  {
    path: 'leader', 
    component: DelegationLeaderComponent,
    children: [
      {
        path: '',
        component: OverviewComponent
      },
      {
        path: 'overview',
        component: OverviewComponent
      },      
      {
        path: 'participant',
        component: ParticipantComponent
      },
      {
        path: 'team',
        component: TeamComponent
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
