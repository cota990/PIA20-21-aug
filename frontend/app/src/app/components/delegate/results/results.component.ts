import { Component, OnInit } from '@angular/core';
import { Competition } from 'src/app/models/Competition';
import { CompetitionService } from 'src/app/services/competition.service';

@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css']
})
export class ResultsComponent implements OnInit {

  constructor(private competitionService: CompetitionService) { }

  ngOnInit(): void {

    this.errorsFound = '';

    let user = JSON.parse(sessionStorage.getItem('user'));

    this.sportsOptions = [];

    this.competitionService.getAllCompetitionsForDelegate(user.username).subscribe ((competitions: Competition[]) => {

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

  numOfGroups: number;
  competitors: Object[];

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

    if (this.selectedCompetition.round == 'Q') {

      let competitors = [];
      let groups = [];

      if (this.selectedCompetition.category == 'I') {

        for (let i = 0; i < this.selectedCompetition.participants.length; i++) {

          let index = groups.indexOf (this.selectedCompetition.participants[i].qualificationGroup);

          if (index == -1) {

            groups.push (this.selectedCompetition.participants[i].qualificationGroup);

            let newGroup = {
              groupName: this.selectedCompetition.participants[i].qualificationGroup,
              competitors: []
            };

            newGroup.competitors.push (this.selectedCompetition.participants[i]);
            competitors.push (newGroup);

          }

          else {

            competitors[index].competitors.push (this.selectedCompetition.participants[i]);

          }

        }

      }

      this.competitors = competitors;
      console.log (this.competitors);
        
        
    }

    else if (this.selectedCompetition.round == 'F') {

      if (this.selectedCompetition.category == 'I') {

        let competitors = [];

        let newGroup = {
          groupName: "Finals",
          competitors: []
        };

        this.selectedCompetition.participants.forEach ((p) => {

          if (p.qualificationPosition == undefined || p.qualificationPosition <= 8)
            newGroup.competitors.push (p);

        });

        competitors.push (newGroup);

        this.competitors = competitors;
        console.log (this.competitors);

      }

    }

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

      let times = score.split(',');

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

      if (times.length == 2) {

        let secondsHundreths = times[1].split(',');

        if (secondsHundreths.length == 2) {

          let minutes = parseInt(times[0]);
          let seconds = parseInt(secondsHundreths[0]);
          let hundreths = parseInt(secondsHundreths[1]);

          if (isNaN (minutes) || isNaN (seconds) || isNaN (hundreths))
            return false;

          else if (minutes >= 60 || seconds >= 60 || hundreths >= 100)
            return false;

          else return true;

        }

        else return false;

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

  submitResultsForRound (competitors) {

    console.log ('submit results');

    // check if all results are submitted

    let errorFound: boolean = false;

    competitors.forEach ((c) => {

      if ((this.selectedCompetition.round == 'Q' && (c.qualificationResult == undefined || c.qualificationResult == ''))
          || (this.selectedCompetition.round == 'F' && (c.finalResult == undefined || c.finalResult == ''))) {

        errorFound = true;

      }

      
    })

    if (errorFound)
      this.errorsFound = 'All scores for group must entered';
    
    else {

      this.errorsFound = '';

      competitors.forEach ((c) => {

        if ((this.selectedCompetition.round == 'Q' && !this.checkScoreFormat(c.qualificationResult, this.selectedCompetition.scoreFormat))
          || (this.selectedCompetition.round == 'F' && !this.checkScoreFormat(c.finalResult, this.selectedCompetition.scoreFormat))) {

        errorFound = true;

        }

      })

      if (errorFound)
      this.errorsFound = 'All scores must be in ' + this.selectedCompetition.scoreFormat + ' format';
    
      else {

        this.errorsFound = 'proceed';

        console.log (this.selectedCompetition);

      }

    }

  }


}
