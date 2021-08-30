import { Component, OnInit } from '@angular/core';
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
  }

}
