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
import { MenuComponent } from './components/menu/menu.component';
import { UnregisteredMenuComponent } from './components/menu/unregistered-menu/unregistered-menu.component';
import { CountriesComponent } from './components/unregistered/countries/countries.component';
import { OrganizerMenuComponent } from './components/menu/organizer-menu/organizer-menu.component';
import { DelegateMenuComponent } from './components/menu/delegate-menu/delegate-menu.component';
import { DelegationLeaderMenuComponent } from './components/menu/delegation-leader-menu/delegation-leader-menu.component';
import { MedalsVisualizationComponent } from './components/unregistered/medals-visualization/medals-visualization.component';
import { ParticipantsComponent } from './components/unregistered/participants/participants.component';
import { OverviewComponent } from './components/delegation-leader/overview/overview.component';
import { ParticipantComponent } from './components/delegation-leader/participant/participant.component';
import { TeamComponent } from './components/delegation-leader/team/team.component';
import { SportsComponent } from './components/organizer/sports/sports.component';
import { CompetitionsComponent } from './components/organizer/competitions/competitions.component';
import { RequestsComponent } from './components/organizer/requests/requests.component';
import { RecordsComponent } from './components/organizer/records/records.component';
import { FormatComponent } from './components/organizer/format/format.component';
import { CompetitionParticipantsComponent } from './components/organizer/competition-participants/competition-participants.component';
import { ScheduleComponent } from './components/delegate/schedule/schedule.component';
import { ResultsComponent } from './components/delegate/results/results.component';


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
    PasswordResetComponent,
    MenuComponent,
    UnregisteredMenuComponent,
    CountriesComponent,
    OrganizerMenuComponent,
    DelegateMenuComponent,
    DelegationLeaderMenuComponent,
    MedalsVisualizationComponent,
    ParticipantsComponent,
    OverviewComponent,
    ParticipantComponent,
    TeamComponent,
    SportsComponent,
    CompetitionsComponent,
    RequestsComponent,
    RecordsComponent,
    FormatComponent,
    CompetitionParticipantsComponent,
    ScheduleComponent,
    ResultsComponent
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
