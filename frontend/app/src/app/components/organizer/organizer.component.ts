import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-organizer',
  templateUrl: './organizer.component.html',
  styleUrls: ['./organizer.component.css']
})
export class OrganizerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    MenuComponent.menuSelector = 'organizer';
    HeaderComponent.unregisteredPage = false;
    
  }

}
