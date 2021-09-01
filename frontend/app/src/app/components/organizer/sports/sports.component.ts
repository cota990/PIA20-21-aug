import { Component, OnInit } from '@angular/core';
import { DisciplineSelect } from 'src/app/utils/DisciplineSelect';
import { Sport } from 'src/app/models/Sport';
import { SportDiscipline } from 'src/app/utils/SportDiscipline';
import { SportService } from 'src/app/services/sport.service';

@Component({
  selector: 'app-sports',
  templateUrl: './sports.component.html',
  styleUrls: ['./sports.component.css']
})
export class SportsComponent implements OnInit {

  constructor(private sportsService: SportService) { }

  ngOnInit(): void {

    this.errorsFound = '';

    this.addedSportDisciplines = [];

    this.sportsService.getAllSportsInOlympics().subscribe((sports: Sport[]) => {

      this.addedSportDisciplines = [];

      sports.forEach ((sport) => {

        let sportFound = false;
        this.addedSportDisciplines.forEach ( (sportDiscipline) => {

          if (sportDiscipline.sport == sport.name) {

            sportFound = true;
            
            sportDiscipline.disciplinesString.push (sport.discipline);

          }            

        })

        if (!sportFound) {

          let sportDiscipline = new SportDiscipline ();
          sportDiscipline.sport = sport.name;
          sportDiscipline.disciplinesString = [];
          
          sportDiscipline.disciplinesString.push (sport.discipline);

          this.addedSportDisciplines.push (sportDiscipline);

        }

      })

      this.addedSportDisciplines.sort( (a, b) => {

        if (a.sport > b.sport) return 1;
        else if (a.sport < b.sport) return -1;
        else {
          if (a.disciplinesString > b.disciplinesString) return 1;
          else if (a.disciplinesString < b.disciplinesString) return -1;
          else return 0;
        }
      })

    })

    this.sportsService.getAllSportsNotInOlympics().subscribe((sports: Sport[]) => {

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

  sportDisciplines : SportDiscipline[];
  disciplinesOptions: DisciplineSelect[];

  addedSportDisciplines: SportDiscipline[];

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
    
    if (this.sport == undefined || this.sport == '')
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

        this.sportsService.addToOlympics(this.sport, this.discipline).subscribe((res) => {
          console.log (res);
          this.errorsFound = res['message'];

          if (res['message'] == 'Successfully added new discipline') {

            this.sport = '';
            this.discipline = '';

            // update lists

            // update added
            let sportFound = false;
            let i: number = -1;
            this.addedSportDisciplines.forEach ((sportDiscipline, index) => {

              if (sportDiscipline.sport == res['sport']) {

                sportFound = true;
                i = index;

              }
                
            })

            if (!sportFound) {

              let sportDiscipline = new SportDiscipline ();
              sportDiscipline.sport = res['sport'];
              sportDiscipline.disciplinesString = [];
              
              sportDiscipline.disciplinesString.push (res['discipline']);

              this.addedSportDisciplines.push (sportDiscipline);

            }
            

            else {

              //this.addedSportDisciplines[i].disciplinesString.push (res['discipline']);

              let tempObj = new SportDiscipline();
              tempObj.sport = this.addedSportDisciplines[i].sport;
              tempObj.disciplinesString = [];

              this.addedSportDisciplines[i].disciplinesString.forEach ( (s) => {

                tempObj.disciplinesString.push (s);

              })

              tempObj.disciplinesString.push(res['discipline']);

              this.addedSportDisciplines.splice(i, 1);

              this.addedSportDisciplines.splice(i, 0, tempObj);
            }

            this.addedSportDisciplines.sort( (a, b) => {

              if (a.sport > b.sport) return 1;
              else if (a.sport < b.sport) return -1;
              else {
                if (a.disciplinesString > b.disciplinesString) return 1;
                else if (a.disciplinesString < b.disciplinesString) return -1;
                else return 0;
              }
            })

            //update available
            let i1: number = -1, i2: number = -1;
            let sportsFound: boolean = false;

            this.sportDisciplines.forEach ( (sportDiscipline, index, array) => {

              if (sportDiscipline.sport == res['sport']) {

                let disciplineFound: boolean = false;
                sportDiscipline.disciplines.forEach ( (discipline, index, array) => {

                  if (discipline.discipline == res['discipline']) {

                    i2 = index;
                    disciplineFound = true;
                  
                  }
                    

                })

                if (disciplineFound && !sportsFound) {

                  i1 = index;
                  sportsFound = true;
                }
                
              }

            });

            if (i2 > -1 ) {

              let tempObj = new SportDiscipline();
              tempObj.sport = this.sportDisciplines[i1].sport;
              tempObj.disciplines = [];

              this.sportDisciplines[i1].disciplines.forEach( (s) => {

                if (s.discipline != res['discipline']) {

                  let disSel = new DisciplineSelect();
                  disSel.discipline = s.discipline;
                  disSel.selected = false;

                  tempObj.disciplines.push(disSel);
                
                }

              })

              this.sportDisciplines.splice(i1, 1);

              this.sportDisciplines.splice(i1, 0, tempObj);

              if (tempObj.disciplines.length == 0) {

                this.sportDisciplines.splice(i1, 1);

              }

            }
            
            this.getDisciplinesFromSelectedSport();

          }

        })

      }

    }
  }

}
