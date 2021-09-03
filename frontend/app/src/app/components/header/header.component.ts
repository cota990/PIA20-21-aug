import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    
  }

  static displayUserPanel: boolean = false;
  static loggedUsername: string = '';
  static loggedType: string = '';
  static unregisteredPage: boolean = false;

  getDisplayUserPanel (): boolean {
    return HeaderComponent.displayUserPanel;
  }

  getLoggedUsername (): string {
    return HeaderComponent.loggedUsername;
  }

  getLoggedType (): string {
    return HeaderComponent.loggedType;
  }

  getUnregisteredPage (): boolean {
    return HeaderComponent.unregisteredPage;
  }

  signOut () {

    HeaderComponent.displayUserPanel = false;
    HeaderComponent.loggedUsername = '';
    HeaderComponent.loggedType = '';
    HeaderComponent.unregisteredPage = false;

    MenuComponent.menuSelector = '';

    sessionStorage.removeItem('user');

    this.router.navigate(['']);
    
  }

  signIn () {

    HeaderComponent.displayUserPanel = false;
    HeaderComponent.loggedUsername = '';
    HeaderComponent.loggedType = '';
    HeaderComponent.unregisteredPage = false;

    MenuComponent.menuSelector = '';

    this.router.navigate(['']);

  }
 
}
