import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-organizer-menu',
  templateUrl: './organizer-menu.component.html',
  styleUrls: ['./organizer-menu.component.css','../menu.component.css', '../../header/header.component.css']
})
export class OrganizerMenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.sportsClicked = true;
    this.competitionsClicked = false;
    this.requestsClicked = false;
    this.recordsClicked = false;
  }

  sportsClicked: boolean;
  competitionsClicked: boolean;
  requestsClicked: boolean;
  recordsClicked: boolean;

  setRoute (route: string) {

    if (route == 'organizer/sports') {
      
      this.sportsClicked = true;
      this.competitionsClicked = false;
      this.requestsClicked = false;
      this.recordsClicked = false;
    
    }

    else if (route == 'organizer/competitions') {
      
      this.sportsClicked = false;
      this.competitionsClicked = true;
      this.requestsClicked = false;
      this.recordsClicked = false;
      
    }

    else if (route == 'organizer/requests') {
      
      this.sportsClicked = false;
      this.competitionsClicked = false;
      this.requestsClicked = true;
      this.recordsClicked = false;
      
    }

    else if (route == 'organizer/records') {
      
      this.sportsClicked = false;
      this.competitionsClicked = false;
      this.requestsClicked = false;
      this.recordsClicked = true;
      
    }

    this.router.navigate([route]);

    
  }

}
