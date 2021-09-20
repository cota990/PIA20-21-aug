import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-delegate',
  templateUrl: './delegate.component.html',
  styleUrls: ['./delegate.component.css']
})
export class DelegateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {

    MenuComponent.menuSelector = 'delegate';
    HeaderComponent.unregisteredPage = false;

  }

}
