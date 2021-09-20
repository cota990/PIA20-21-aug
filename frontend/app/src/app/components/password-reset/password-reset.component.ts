import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit {

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    
    this.errorsFound = '';
  
  }

  errorsFound: string;

  username: string;
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;

  changePassword() {
    
    if (this.username == undefined || this.username == ''
        || this.oldPassword == undefined || this.oldPassword == ''
        || this.newPassword == undefined || this.newPassword == ''
        || this.passwordConfirmation == undefined || this.passwordConfirmation == '')
      this.errorsFound = 'All fields are required';
    
    else if (this.newPassword != this.passwordConfirmation)
      this.errorsFound = 'Password confirmation does not match password';

    else {

      this.errorsFound = '';

      this.userService.changePassword(this.username, this.oldPassword, this.newPassword).subscribe((res) => {

        console.log (res);

        if (res['message'] == 'Errors found') {

          this.errorsFound = res['passwordRules'];

        }

        else
          this.errorsFound = res['message'];

      })

    }
  
  }

}
