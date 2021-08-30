import { Component, OnInit } from '@angular/core';
import { Country } from 'src/app/models/Country';
import { Participant } from 'src/app/models/Participant';
import { Sport } from 'src/app/models/Sport';
import { CountryService } from 'src/app/services/country.service';
import { ParticipantService } from 'src/app/services/participant.service';
import { SportService } from 'src/app/services/sport.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private sportsService: SportService, private participantService: ParticipantService, private countryService: CountryService) { }

  ngOnInit(): void {

    let signedInUser = JSON.parse(sessionStorage.getItem('user'));

    this.countryService.getCountryByAbbr(signedInUser.country).subscribe( (country: Country) => {
      this.country = country;
    })

    this.sportsService.getAllSports().subscribe((sports: Sport[]) => {
      this.allSports = sports;
    })

    this.participantService.getAllParticipantsForCountry(signedInUser.country).subscribe( (participants: Participant[]) => {

      this.allParticipants = participants;
      this.numOfParticipants = participants.length;

    })
  }

  allSports: Sport[];
  allParticipants: Participant[];
  numOfParticipants: number = 0;
  country: Country;

}
