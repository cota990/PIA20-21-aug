import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delegate-menu',
  templateUrl: './delegate-menu.component.html',
  styleUrls: ['./delegate-menu.component.css','../menu.component.css', '../../header/header.component.css']
})
export class DelegateMenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {

    this.scheduleClicked = true;
    this.resultsClicked = false;

  }

  scheduleClicked: boolean;
  resultsClicked: boolean;

  setRoute (route: string) {

    if (route == 'delegate/schedule') {
      
      this.scheduleClicked = true;
      this.resultsClicked = false;
    
    }

    else if (route == 'delegate/results') {

      this.scheduleClicked = false;
      this.resultsClicked = true;

    }

    this.router.navigate([route]);

  }

}
