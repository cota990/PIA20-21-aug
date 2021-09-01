import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/User';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styleUrls: ['./requests.component.css']
})
export class RequestsComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {

    this.requests = [];

    this.userService.pendingRequests().subscribe((users: User[]) => {

      this.requests = users;

    })
  }

  requests: User [];

  accept (username: string) {
    console.log ('accept (' + username + ')');
  }

  reject (username: string) {
    console.log ('reject (' + username + ')');
  }

}
