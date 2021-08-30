import { Component, OnInit } from '@angular/core';
import { Sport } from 'src/app/models/Sport';
import { SportService } from 'src/app/services/sport.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css']
})
export class OverviewComponent implements OnInit {

  constructor(private sportsService: SportService) { }

  ngOnInit(): void {

    this.sportsService.getAllSports().subscribe((sports: Sport[]) => {
      this.allSports = sports;
    })
  }

  allSports: Sport[];

}
