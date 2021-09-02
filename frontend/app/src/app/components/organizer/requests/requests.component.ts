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
    
    this.userService.approveRequest(username).subscribe((res) => {

      alert (res['message']);

      if (res['message'] == 'Account approved') {

        //remove from list
        let i: number = -1;
        this.requests.forEach( (user, index) => {

          if (user.username == username)
            i = index;

        })

        let tempObj = new User ();
        this.requests.splice(i, 1);
        this.requests.splice(i, 0, tempObj);
        this.requests.splice(i, 1);

      }

    })

  }

  reject (username: string) {
    
    this.userService.rejectRequest(username).subscribe((res) => {

      alert (res['message']);

      if (res['message'] == 'Account rejected') {

        //remove from list
        let i: number = -1;
        this.requests.forEach( (user, index) => {

          if (user.username == username)
            i = index;

        })

        let tempObj = new User ();
        this.requests.splice(i, 1);
        this.requests.splice(i, 0, tempObj);
        this.requests.splice(i, 1);

      }

    })
    
  }

}
