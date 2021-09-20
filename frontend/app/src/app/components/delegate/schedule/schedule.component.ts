import { Component, OnInit } from '@angular/core';
import { Competition } from 'src/app/models/Competition';
import { CompetitionService } from 'src/app/services/competition.service';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {

  constructor(private competitionService: CompetitionService) { }

  ngOnInit(): void {

    this.errorsFound = '';

    let user = JSON.parse(sessionStorage.getItem('user'));

    this.sportsOptions = [];

    this.competitionService.getAllCompetitionsForDelegate(user.username).subscribe ((competitions: Competition[]) => {

      console.log (competitions);

      this.competitions = competitions;

      competitions.forEach ((c) => {

        if (this.sportsOptions.indexOf (c.sport) == -1)
          this.sportsOptions.push (c.sport);

      });

    });

  }

  competitions: Competition[];
  selectedCompetition: Competition;

  sport: string;
  discipline: string;

  sportsOptions: string[];
  disciplineOptions: string[];

  errorsFound: string;

  goToSport() {

    this.disciplineOptions = [];
    this.selectedCompetition = undefined;

    this.competitions.forEach ((c) => {

      if (this.sport == c.sport)
        this.disciplineOptions.push (c.discipline + '(' + c.gender + ')');

    });

  }

  goToDiscipline () {

    let disciplineGender = this.discipline.slice(0, this.discipline.length - 1).split('(');

    this.competitions.forEach ((c) => {

      if (c.sport == this.sport && c.discipline == disciplineGender[0] && c.gender == disciplineGender[1])
        this.selectedCompetition = c;

    });

    console.log (this.selectedCompetition);

  }

  generateEvents () {

    this.competitionService.generateSchedule(this.selectedCompetition).subscribe ((res) => {

      console.log ('generate schedule complete');
      console.log (res);

      if (res['message'] == undefined) {

        this.selectedCompetition = res as Competition;

      }
        
    });

  }

  checkDateFormat (dateString: string)  {

    if (dateString.length != 19)
      return false;

    else

      for (let i = 0; i < dateString.length; i++) {

        if (i == 4 || i == 7) {

          if (dateString[i] != '-') {
            
            return false;

          }

        }

        else if (i == 10) {

          if (dateString[i] != ' ') {
            
            return false;

          }

        }

        else if (i == 13 || i == 15) {

          if (dateString[i] != ':') {
            
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

  assignStartAndLocation (s) {

    if (s.startDateTime == undefined || s.startDateTime == ''
        || s.location == undefined || s.location == '')
        this.errorsFound = 'All fields are required';

    else {

      this.errorsFound = '';

      if (this.checkDateFormat (s.startDateTime)) {

        this.competitionService.updateSchedule(this.selectedCompetition).subscribe ((res) => {

          console.log ('update schedule complete');
          console.log (res);

          if (res['message'] == undefined) {

            this.selectedCompetition = res as Competition;

          }
            
        });

      }

      else 
        this.errorsFound = 'Date and time in wrong format';

    }

  }

}
