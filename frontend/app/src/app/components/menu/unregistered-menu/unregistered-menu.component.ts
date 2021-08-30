import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-unregistered-menu',
  templateUrl: './unregistered-menu.component.html',
  styleUrls: ['./unregistered-menu.component.css', '../menu.component.css', '../../header/header.component.css']
})
export class UnregisteredMenuComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
    
    this.countriesClicked = true;
    this.medalsCountClicked = false;
    this.medalsVisualizationClicked = false;
    this.participantsClicked = false;

  }
  
  countriesClicked: boolean;
  medalsCountClicked: boolean;
  medalsVisualizationClicked: boolean;
  participantsClicked: boolean;

  setRoute (route: string) {

    if (route == 'unregistered/countries') {
      
      this.countriesClicked = true;
      this.medalsCountClicked = false;
      this.medalsVisualizationClicked = false;
      this.participantsClicked = false;
    
    }
    
    else if (route == 'unregistered/medalsCount') {
      
      this.countriesClicked = false;
      this.medalsCountClicked = true;
      this.medalsVisualizationClicked = false;
      this.participantsClicked = false;

    }

    else if (route == 'unregistered/medalsVisualization') {
      
      this.countriesClicked = false;
      this.medalsCountClicked = false;
      this.medalsVisualizationClicked = true;
      this.participantsClicked = false;
      
    }

    else if (route == 'unregistered/participants') {
      
      this.countriesClicked = false;
      this.medalsCountClicked = false;
      this.medalsVisualizationClicked = false;
      this.participantsClicked = true;
      
    }

    this.router.navigate([route]);

    
  }

}
