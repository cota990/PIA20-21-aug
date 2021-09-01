import { Component, OnInit } from '@angular/core';
import { Sport } from 'src/app/models/Sport';
import { SportService } from 'src/app/services/sport.service';
import { TeamService } from 'src/app/services/team.service';
import { DisciplineSelect } from 'src/app/utils/DisciplineSelect';
import { SportDiscipline } from 'src/app/utils/SportDiscipline';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor(private sportsService: SportService, private teamsService:TeamService) { }

  ngOnInit(): void {

    this.errorsFound = '';

    let user = JSON.parse(sessionStorage.getItem('user'));
    this.country = user.country;

    this.sportsService.getAllTeamSportsInOlympics().subscribe((sports: Sport[]) => {

      this.sportDisciplines = [];

      sports.forEach ((sport) => {

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

  sport: string;
  discipline: string;
  gender: string;
  country: string;

  sportDisciplines : SportDiscipline[];
  disciplinesOptions: DisciplineSelect[];

  getDisciplinesFromSelectedSport () {

    if (this.sport == undefined) { 
      
      this.disciplinesOptions = undefined;
      this.discipline = undefined;
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
    
    if (this.gender == undefined || this.gender == ''
        || this.sport == undefined || this.sport == '')
        this.errorsFound = 'All fields are required';

    else {

      this.errorsFound = '';

      // collect discipline

      if (this.disciplinesOptions == undefined) {

        this.discipline = this.sport; 
      
      }

      else {

        let disciplineFound = false;

        this.disciplinesOptions.forEach ((disc) => {

          if (disc.discipline == this.discipline)
            disciplineFound = true;
        });

        if (!disciplineFound) {

          this.discipline = undefined;

        }
      
      }

      if (this.discipline == undefined || this.discipline == '')
        this.errorsFound = 'All fields are required';

      else {

        this.teamsService.submitTeam(this.country, this.gender, this.sport, this.discipline).subscribe((res) => {
          console.log (res);
          this.errorsFound = res['message'];
        })

      }

    }

  }

}
