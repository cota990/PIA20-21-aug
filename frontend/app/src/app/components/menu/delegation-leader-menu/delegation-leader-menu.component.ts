import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delegation-leader-menu',
  templateUrl: './delegation-leader-menu.component.html',
  styleUrls: ['./delegation-leader-menu.component.css', '../menu.component.css', '../../header/header.component.css']
})
export class DelegationLeaderMenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.overviewClicked = true;
    this.participantClicked = false;
    this.teamClicked = false;
  }

  overviewClicked: boolean;
  participantClicked: boolean;
  teamClicked: boolean;

  setRoute (route: string) {

    if (route == 'leader/overview') {
      
      this.overviewClicked = true;
      this.participantClicked = false;
      this.teamClicked = false;
    
    }

    else if (route == 'leader/participant') {
      
      this.overviewClicked = false;
      this.participantClicked = true;
      this.teamClicked = false;
      
    }

    else if (route == 'leader/team') {
      
      this.overviewClicked = false;
      this.participantClicked = false;
      this.teamClicked = true;
      
    }

    this.router.navigate([route]);

    
  }

}
