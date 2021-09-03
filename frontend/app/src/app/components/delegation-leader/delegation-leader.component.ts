import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-delegation-leader',
  templateUrl: './delegation-leader.component.html',
  styleUrls: ['./delegation-leader.component.css']
})
export class DelegationLeaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    MenuComponent.menuSelector = 'leader';
    HeaderComponent.unregisteredPage = false;
  }

}
