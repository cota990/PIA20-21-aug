import { Component, OnInit } from '@angular/core';
import { DisciplineSelect } from 'src/app/utils/DisciplineSelect';
import { Sport } from 'src/app/models/Sport';
import { ParticipantService } from 'src/app/services/participant.service';
import { SportService } from 'src/app/services/sport.service';
import { SportDiscipline } from 'src/app/utils/SportDiscipline';

@Component({
  selector: 'app-participant',
  templateUrl: './participant.component.html',
  styleUrls: ['./participant.component.css']
})
export class ParticipantComponent implements OnInit {

  constructor(private sportsService: SportService, private participantsService: ParticipantService) { }

  ngOnInit(): void {

    this.errorsFound = '';

    let user = JSON.parse(sessionStorage.getItem('user'));
    this.country = user.country;

    this.sportsService.getAllSportsInOlympics().subscribe((sports: Sport[]) => {
      
      this.allSports = sports;
      this.sportDisciplines = [];

      this.allSports.forEach ((sport) => {

        let sportFound = false;
        this.sportDisciplines.forEach ( (sportDiscipline) => {

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

          this.sportDisciplines.push (sportDiscipline);

        }
      })

      
    })

  }

  errorsFound: string;
  
  firstname: string;
  lastname: string;
  gender: string;
  sport: string;
  disciplines: string[];
  country: string;

  allSports: Sport[];
  sportDisciplines : SportDiscipline[];

  selectedSportDiscipline: SportDiscipline;

  disciplinesOptions : DisciplineSelect [];

  getDisciplinesFromSelectedSport () {

    if (this.sport == undefined) { 
      
      this.disciplinesOptions = undefined;
      return undefined; 

    }
    
    else {

      let disciplines: DisciplineSelect [];

      this.sportDisciplines.forEach ((sd) => {

        if (sd.sport == this.sport) {

          if (sd.disciplines != undefined && sd.disciplines.length > 0 && (sd.disciplines.length > 1 || sd.disciplines[0].discipline != this.sport)) 
            disciplines = sd.disciplines;
        
        }
      
      })

      this.disciplinesOptions = disciplines;

      return disciplines;

    }
    
  }

  submit () {

    if (this.firstname == undefined || this.firstname == ''
        || this.lastname == undefined || this.lastname == ''
        || this.gender == undefined || this.gender == ''
        || this.sport == undefined || this.sport == '')
        this.errorsFound = 'All fields are required';
    
    else {

      this.errorsFound = '';

      // collect disciplines

      this.disciplines = [];

      if (this.disciplinesOptions != undefined) {

        this.disciplinesOptions.forEach ( (option) => {

          if (option.selected)
            this.disciplines.push (option.discipline);

        })
      
      }

      else {

        this.disciplines.push (this.sport);

      }

      if (this.disciplines.length == 0)
        this.errorsFound = 'At least one discipline is required';

      else {
        
        this.participantsService.submitParticipant(this.firstname, this.lastname, this.gender, this.sport, this.disciplines, this.country).subscribe((res) => {
          console.log (res);
          
          if (res['message'] == 'Errors found') {
          
            if (res['competitionsStarted'] != '')
              this.errorsFound += res['competitionsStarted'] + '. ';
  
            if (res['teamDisciplines'] != '')
              this.errorsFound += res['teamDisciplines'] + '. ';
  
            if (res['differentSport'] != '')
              this.errorsFound += res['differentSport'] + '. ';
  
            if (res['noNewDisciplines'] != '')
              this.errorsFound += res['noNewDisciplines'];
            
          }
  
          else this.errorsFound = res['message'];

        });

      }
    }

  }

}
