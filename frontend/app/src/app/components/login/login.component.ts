import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit(): void {
  }

  username: string;
  password: string;

  signIn () {
    
    this.userService.login(this.username, this.password).subscribe((user: User) => {
      
      if (user) {
        
        if (!user.approved)
          alert('account not approved yet');
        
        else {

          localStorage.setItem('user', JSON.stringify(user));
          if (user.type == 'O')
            this.router.navigate(['organizer']);
          
          else if (user.type == 'D')
            this.router.navigate(['delegate']); 

          else if (user.type == 'L')
            this.router.navigate(['leader']);

          HeaderComponent.displayUserPanel = true;
          HeaderComponent.loggedUsername = user.username;
          HeaderComponent.loggedType = user.type;

        }
      
      }

      else
        alert('bad data'); // TODO sta ako je bila greska
    })
  }

  register() {
    this.router.navigate(['register']);
  }

}
