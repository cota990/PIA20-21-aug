import { Component, OnInit } from '@angular/core';
import { Location } from 'src/app/models/Location';
import { Participant } from 'src/app/models/Participant';
import { ScoreFormat } from 'src/app/models/ScoreFormat';
import { Sport } from 'src/app/models/Sport';
import { Team } from 'src/app/models/Team';
import { User } from 'src/app/models/User';
import { LocationService } from 'src/app/services/location.service';
import { ParticipantService } from 'src/app/services/participant.service';
import { ScoreFormatService } from 'src/app/services/score-format.service';
import { SportService } from 'src/app/services/sport.service';
import { TeamService } from 'src/app/services/team.service';
import { UserService } from 'src/app/services/user.service';
import { DisciplineSelect } from 'src/app/utils/DisciplineSelect';
import { SportDiscipline } from 'src/app/utils/SportDiscipline';

@Component({
  selector: 'app-competitions',
  templateUrl: './competitions.component.html',
  styleUrls: ['./competitions.component.css']
})
export class CompetitionsComponent implements OnInit {

  constructor(private sportsService: SportService, 
              private scoreFormatService: ScoreFormatService,
              private locationService: LocationService,
              private userService: UserService,
              private participantsService: ParticipantService,
              private teamService: TeamService) { }

  ngOnInit(): void {

    this.errorsFound = '';
    this.category = 'I';

    this.individualSportsDisciplines = [];
    this.teamSportsDisciplines = [];

    this.formatOptions = [];
    this.locationOptions = [];
    this.availableDelegates = [];

    this.displayParticipants = false;
    this.displayTeams = false;

    this.sportsService.getAllSportsInOlympics().subscribe((sports: Sport[]) => {

      sports.forEach ((sport) => {

        let sportFound = false;

        if (sport.type == 'I') {

          this.individualSportsDisciplines.forEach ( (sportDiscipline) => {

            if (sportDiscipline.sport == sport.name) {
  
              sportFound = true;
  
              let disciplineSelect: DisciplineSelect = new DisciplineSelect();
              disciplineSelect.discipline = sport.discipline;
              disciplineSelect.selected = false;
              
              sportDiscipline.disciplines.push (disciplineSelect);
  
            }
  
          })
            
          if (!sportFound) {

            let sportDiscipline = new SportDiscipline ();
            sportDiscipline.sport = sport.name;
            sportDiscipline.disciplines = [];
  
            let disciplineSelect: DisciplineSelect = new DisciplineSelect();
            disciplineSelect.discipline = sport.discipline;
            disciplineSelect.selected = false;
            
            sportDiscipline.disciplines.push (disciplineSelect);
  
            this.individualSportsDisciplines.push (sportDiscipline);
  
          }

        }

        else if (sport.type == 'T') {

          this.teamSportsDisciplines.forEach ( (sportDiscipline) => {

            if (sportDiscipline.sport == sport.name) {
  
              sportFound = true;
  
              let disciplineSelect: DisciplineSelect = new DisciplineSelect();
              disciplineSelect.discipline = sport.discipline;
              disciplineSelect.selected = false;
              
              sportDiscipline.disciplines.push (disciplineSelect);
  
            }
  
          })

          if (!sportFound) {

            let sportDiscipline = new SportDiscipline ();
            sportDiscipline.sport = sport.name;
            sportDiscipline.disciplines = [];
  
            let disciplineSelect: DisciplineSelect = new DisciplineSelect();
            disciplineSelect.discipline = sport.discipline;
            disciplineSelect.selected = false;
            
            sportDiscipline.disciplines.push (disciplineSelect);
  
            this.teamSportsDisciplines.push (sportDiscipline);
  
          }

        }

      })

    });

    this.formatDescription = '';

    this.scoreFormatService.getAllScoreFormats().subscribe( (formats: ScoreFormat[]) => {

      this.formatOptions = formats;

      this.formatOptions.forEach ( (fo) => {

        fo.label = fo.type + '(' + fo.format + ')';

      })

    });

    this.locationService.getAllLocations().subscribe( (locations: Location[]) => {

      this.allLocations = locations;

    });

    this.userService.getAvailableDelegates().subscribe( (delegates: User[]) => {

      delegates.forEach( (delegate) => {

        let delegateOption = new User();
        delegateOption.fullname = delegate.lastname + ', ' + delegate.firstname;
        delegateOption.username = delegate.username;
        delegateOption.country = delegate.country;
        delegateOption.selected = false;
        
        this.availableDelegates.push (delegateOption);

      })

    });

  }

  errorsFound: string;

  category: string;
  sport: string;
  discipline: string;
  gender: string;
  format: string;
  allowedResults: string;
  phases: string;
  rounds: string;
  startDate: string;
  endDate: string;
  locations: string[];
  delegates: string[];
  participants: string[];
  teams: string[];

  disciplinesOptions: DisciplineSelect[];
  locationOptions: Location[];

  allLocations: Location[];
  availableDelegates: User[];

  participantsOptions: Participant[];
  teamsOptions: Team[];

  individualSportsDisciplines: SportDiscipline[];
  teamSportsDisciplines: SportDiscipline[];

  formatOptions: ScoreFormat[];
  formatDescription: string;

  displayParticipants: boolean;
  displayTeams: boolean;

  radioChanged () {
    
    this.sport = undefined;
    this.discipline = undefined;
    this.disciplinesOptions = undefined;
    this.locationOptions = [];
    this.displayTeams = false;
    this.displayParticipants = false;

  }

  genderChanged () {

    console.log ('genderChanged');

    if (this.gender != undefined && this.gender != ''
          && this.sport != undefined && this.sport != ''
          && (this.disciplinesOptions == undefined || (this.discipline != undefined && this.discipline != ''))) {

      if (this.category == 'I') {

        this.displayTeams = false;
        this.displayParticipants = true;

        this.teamsOptions = [];

        // fetch participants
        this.fetchParticipants ();

      }

      else if (this.category == 'T') {

        this.displayTeams = true;
        this.displayParticipants = false;

        this.participantsOptions = [];

        // fetch teams
        this.fetchTeams();

      }

    }

    else {

        this.displayTeams = false;
        this.displayParticipants = false;

        this.participantsOptions = [];
        this.teamsOptions = [];

    }
  
  }

  setDescription() {

    this.formatOptions.forEach ((fo) => {

      if (fo.type == this.format)
        this.formatDescription = fo.description;
    });

  }

  setLocationsAndDisciplines() {

    console.log ('sportChanged');

    this.locationOptions = [];

    this.allLocations.forEach( (loc) => {

      if (loc.sports.indexOf(this.sport) > -1) {

        let locationOption = new Location();
        locationOption.name = loc.name;
        locationOption.sports = loc.sports;
        loc.selected = false;
        
        this.locationOptions.push (locationOption);

      }
        

    });

    if (this.sport == undefined) { 
      
      this.disciplinesOptions = undefined;
      this.discipline = undefined;

    }
    
    else {

      let disciplines: DisciplineSelect [];
      this.discipline = undefined;

      if (this.category == 'I') {

        this.individualSportsDisciplines.forEach ((sd) => {

          if (sd.sport == this.sport) {
  
            if (sd.disciplines != undefined && sd.disciplines.length > 0 && (sd.disciplines.length > 1 || sd.disciplines[0].discipline != this.sport)) 
              disciplines = sd.disciplines;
          
          }
        
        })

      }

      else if (this.category == 'T') {

        this.teamSportsDisciplines.forEach ((sd) => {

          if (sd.sport == this.sport) {
  
            if (sd.disciplines != undefined && sd.disciplines.length > 0 && (sd.disciplines.length > 1 || sd.disciplines[0].discipline != this.sport)) 
              disciplines = sd.disciplines;
          
          }
        
        })

      }

      this.disciplinesOptions = disciplines;

    }

    if (this.gender != undefined && this.gender != ''
          && this.sport != undefined && this.sport != ''
          && (this.disciplinesOptions == undefined || (this.discipline != undefined && this.discipline != ''))) {

      if (this.category == 'I') {

        this.displayTeams = false;
        this.displayParticipants = true;

        this.teamsOptions = [];

        // fetch participants
        this.fetchParticipants ();

      }

      else if (this.category == 'T') {

        this.displayTeams = true;
        this.displayParticipants = false;

        this.participantsOptions = [];

        // fetch teams
        this.fetchTeams();

      }

    }

    else {

      this.displayTeams = false;
      this.displayParticipants = false;

      this.participantsOptions = [];
      this.teamsOptions = [];

    }

  }

  disciplineChanged() {

    console.log ('disciplineChanged');

    if (this.gender != undefined && this.gender != ''
          && this.sport != undefined && this.sport != ''
          && (this.disciplinesOptions == undefined || (this.discipline != undefined && this.discipline != ''))) {

      if (this.category == 'I') {

        this.displayTeams = false;
        this.displayParticipants = true;

        this.teamsOptions = [];

        // fetch participants
        this.fetchParticipants ();

      }

      else if (this.category == 'T') {

        this.displayTeams = true;
        this.displayParticipants = false;

        this.participantsOptions = [];

        // fetch teams
        this.fetchTeams();

      }

    }

    else {

      this.displayTeams = false;
      this.displayParticipants = false;

      this.participantsOptions = [];
      this.teamsOptions = [];

    }

  }

  fetchParticipants () {

    this.participantsService.getAllParticipantsForIndividualDiscipline(this.sport, this.discipline == undefined ? this.sport : this.discipline, this.gender).subscribe((participants: Participant[]) => {

      this.participantsOptions = participants;

      this.participantsOptions.forEach( (p) => {

        p.selected = false;

      });

    });

  }

  fetchTeams () {

    this.teamService.getAllTeamsForTeamDiscipline(this.sport, this.discipline == undefined ? this.sport : this.discipline, this.gender).subscribe((teams: Team[]) => {

      this.teamsOptions = teams;

      this.teamsOptions.forEach ((t) => {

        t.selected = false;

      });

    });

  }

  submit () {
    console.log ('submit');
  }

}
