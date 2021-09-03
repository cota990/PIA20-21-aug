import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/Country';
import { Location } from 'src/app/models/Location';
import { Participant } from 'src/app/models/Participant';
import { ScoreFormat } from 'src/app/models/ScoreFormat';
import { Sport } from 'src/app/models/Sport';
import { Team } from 'src/app/models/Team';
import { User } from 'src/app/models/User';
import { CompetitionService } from 'src/app/services/competition.service';
import { CountryService } from 'src/app/services/country.service';
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
              private teamService: TeamService,
              private countryService: CountryService,
              private competitionsService:CompetitionService) { }

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

    this.allowedResults = '';

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
  rounds: number;
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
    this.locations = [];
    this.startDate = undefined;
    this.endDate = undefined;
    this.format = undefined;
    this.allowedResults = undefined;
    this.phases = undefined;
    this.rounds = undefined;

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

      this.countryService.getAllCountries().subscribe((countries: Country[]) => {

        this.teamsOptions.forEach ((t) => {

          t.selected = false;

          countries.forEach ((country) => {

            if (country.abbr == t.country)
              t.countryName = country.name;

          });
  
        });

      });



    });

  }

  checkScoreFormat (score: string, format: string) {

    console.log (score);console.log (format);

    if (format == 'match') {

      let scores = score.split(':');

      if (scores.length == 2) {

        let score1 = parseInt(scores[0]);
        let score2 = parseInt(scores[1]);

        if (isNaN (score1) || isNaN (score2))
          return false;

        else return true;

      }
      
      else return false;

    }

    else if (format == 'short-race') {

      let times = score.split(':');

      if (times.length == 2) {

        let seconds = parseInt(times[0]);
        let hundreths = parseInt(times[1]);

        if (isNaN (seconds) || isNaN (hundreths))
          return false;

        else if (seconds >= 60 || hundreths >= 100)
          return false;

        else return true;

      }
      
      else return false;

    }

    else if (format == 'medium-race') {

      let times = score.split(':');

      if (times.length == 3) {

        let minutes = parseInt(times[0]);
        let seconds = parseInt(times[1]);
        let hundreths = parseInt(times[2]);

        if (isNaN (minutes) || isNaN (seconds) || isNaN (hundreths))
          return false;

        else if (minutes >= 60 || seconds >= 60 || hundreths >= 100)
          return false;

        else return true;

      }
      
      else return false;

    }

    else if (format == 'long-race') {

      let times = score.split(':');

      if (times.length == 3) {

        let hours = parseInt(times[0]);
        let minutes = parseInt(times[1]);
        let seconds = parseInt(times[2]);

        if (isNaN (hours) || isNaN (minutes) || isNaN (seconds))
          return false;

        else if (hours >= 24 || minutes >= 60 || seconds >= 60)
          return false;

        else return true;

      }
      
      else return false;

    }

    else if (format == 'distance') {

      let distances = score.split(',');

      if (distances.length == 2) {

        let meters = parseInt(distances[0]);
        let centimeters = parseInt(distances[1]);

        if (isNaN (meters) || isNaN (centimeters))
          return false;

        else if (centimeters >= 100)
          return false;

        else return true;

      }
      
      else return false;

    }

    else if (format == 'points') {

      let points = parseInt(score);

      if (isNaN (points))
        return false;

      else if (points < 0)
        return false;

      else return true;

    }

  }

  checkDateFormat (dateString: string)  {

    if (dateString.length != 10)
      return false;

    else

      for (let i = 0; i < dateString.length; i++) {

        if (i == 4 || i == 7) {

          if (dateString[i] != '-') {
            
            return false;

          }
        }

        else 
          if (isNaN(parseInt(dateString[i]))) {

            return false;

          }

      }

    return true;

  }

  submit () {
    console.log ('submit');

    /*
  allowedResults: string;
  rounds: string; */

    // collect all multiple selections
    
    // fix discipline if needed (when there are no options)
    
    if (this.disciplinesOptions == undefined || this.disciplinesOptions.length == 0) 
      this.discipline = this.sport;

    if (this.category == undefined || this.category == ''
        || this.gender == undefined || this.gender == ''
        || this.startDate == undefined || this.startDate == ''
        || this.endDate == undefined || this.endDate == ''
        || this.sport == undefined || this.sport == ''
        || this.format == undefined || this.format == ''
        || this.phases == undefined || this.phases == ''
        || this.discipline == undefined || this.discipline == '')

        this.errorsFound = 'Required fields are missing';

    else {

      // collect all multiple selections
      this.errorsFound = '';

      this.locations = [];

      this.locationOptions.forEach ((l) => {

        if (l.selected)
          this.locations.push (l.name);

      });

      this.delegates = [];

      this.availableDelegates.forEach ((ad) => {

        if (ad.selected)
          this.delegates.push (ad.username);

      });

      this.participants = [];
      this.teams = [];

      if (this.category == 'I') {

        this.participantsOptions.forEach ((p) => {

          if (p.selected)
            this.participants.push (p.lastname + ', ' + p.firstname);

        });

      }

      else if (this.category == 'T') {

        this.teamsOptions.forEach ((t) => {

          if (t.selected)
            this.teams.push (t.country);

        });

      }

      if (this.locations.length == 0
          || this.delegates.length == 0
          || (this.category == 'I' && this.participants.length == 0)
          || (this.category == 'T' && this.teams.length == 0))

        this.errorsFound = 'Required fields are missing';

      else {

        this.errorsFound = '';
        let errorFound = false;

        // format checks

        console.log ('All requireds are filled; check formats');

        let startDateFormat: boolean = this.checkDateFormat (this.startDate);
        let endDateFormat: boolean = this.checkDateFormat (this.endDate);

        if (!startDateFormat || !endDateFormat) {

          errorFound = true;

          if (!startDateFormat && !endDateFormat)
            this.errorsFound += 'Dates in wrong format. ';

          else if (!startDateFormat)
            this.errorsFound += 'Start date in wrong format. ';

          else if (!endDateFormat)
            this.errorsFound += 'End date in wrong format. ';

        }

        else {

          let start = new Date(this.startDate), end = new Date(this.endDate);

          if (!isNaN(start.getMilliseconds()) && !isNaN(end.getMilliseconds())) {

            if (end < start) {

              errorFound = true;
              this.errorsFound += "End date can't be after start date. ";
  
            }
  

          }

          else {

            errorFound = true;

            if (isNaN(start.getMilliseconds()) && isNaN(end.getMilliseconds()))
              this.errorsFound += 'Dates in wrong format. ';

            else if (isNaN(start.getMilliseconds()))
              this.errorsFound += 'Start date in wrong format. ';
  
            else if (isNaN(end.getMilliseconds()))
              this.errorsFound += 'End date in wrong format. ';

          }

        }

        let allowedResultsFormat: boolean = true;

        if (this.allowedResults != undefined && this.allowedResults != '') {

          let allowedResultsArray = this.allowedResults.split(';');
          console.log (allowedResultsArray);

          allowedResultsArray.forEach ((result) => {

            if (!this.checkScoreFormat(result, this.format))
              allowedResultsFormat = false;

          });

        }

        if (!allowedResultsFormat) {

          errorFound = true;
          this.errorsFound += 'Allowed results submitted are in wrong format. ';

        }

        let roundsFormat: boolean = true;

        console.log (this.rounds);

        if (this.rounds == undefined && this.phases == 'F') 
          this.rounds = 1;

        else if (this.phases == 'F' && this.rounds < 1){

          errorFound = true;
          this.errorsFound += 'Number of rounds(attempts) in final round must be greater than 0. ';

        }

        if (!errorFound) {

          // number of players/teams check

          if (this.category == 'I' && this.phases == 'G') {

            errorFound = true;
            this.errorsFound = 'Group stage is not allowed for individual competitions';
          
          }

          else if (this.category == 'I' && this.phases == 'K') {

            if ([4,8,16].indexOf(this.participants.length) == -1) {

              errorFound = true;
              this.errorsFound = 'Number of participants for individual competitions in knockout stage format is 4, 8 or 16';

            }

          }

          else if (this.category == 'I' && this.phases == 'F') {

            if (this.participants.length < 3 || this.participants.length > 8) {

              errorFound = true;
              this.errorsFound = 'Number of participants for individual competitions in final stage format is between 3 and 8';

            }
            
          }

          else if (this.category == 'T' && this.phases == 'G') {

            if (this.teams.length != 12) {

              errorFound = true;
              this.errorsFound = 'Number of teams for team competitions in group stage format is 12';

            }
            
          }

          else if (this.category == 'I' && this.phases == 'K') {

            if ([4,8,16].indexOf(this.teams.length) == -1) {

              errorFound = true;
              this.errorsFound = 'Number of teams for team competitions in knockout stage format is 4, 8 or 16';

            }

          }

          else if (this.category == 'T' && this.phases == 'F') {

            if (this.teams.length < 3 || this.teams.length > 8) {

              errorFound = true;
              this.errorsFound = 'Number of teams for team competitions in final stage format is between 3 and 8';

            }

          }

          if (!errorFound)

          // submit to service
          this.competitionsService.startCompetitionByOrganizer(this.sport, this.discipline, this.category,this.gender, this.format, this.allowedResults.split(';'),
                                  this.phases, this.rounds, this.startDate, this.endDate, this.locations, this.delegates, this.participants, this.teams).subscribe((res) => {

            alert(res['message']);

            if (res['message'] == 'Competition successfully started') {
                
              this.radioChanged();
              this.teamsOptions = [];
              this.participantsOptions = [];
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

          });

        }
         
      
      }
      

    }
  
  }

}
