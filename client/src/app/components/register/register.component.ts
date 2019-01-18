import { Component, OnInit } from '@angular/core';
import { ValidateService } from '../../services/validate.service';
import { AuthService } from '../../services/auth.service';
import { FlashMessagesService } from 'angular2-flash-messages';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  role: any;
  text: string;
  name: String;
  username: String;
  email: String;
  // password: String;

  constructor(
    private validateService: ValidateService,
    private authService: AuthService,
    private router: Router,
    private flashMessage: FlashMessagesService) { }

  ngOnInit() {

     this.text = "";
      let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

      for (var i = 0; i < 8; i++)
        this.text += possible.charAt(Math.floor(Math.random() * possible.length));

  }
  onProfitSelectionChange(entry): void {
this.role = entry;
}
  onRegisterSubmit() {
    const user = {
      name: this.name,
      email: this.email,
      username: this.username,
      password: this.text,
      role: this.role
    }

    if(!this.validateService.validateRegister(user)) {
      this.flashMessage.show('Please fill in all fields', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    if(!this.validateService.validateEmail(user.email)) {
    this.flashMessage.show('Please use a valid email', {cssClass: 'alert-danger', timeout: 3000});
      return false;
    }

    this.authService.checkRole(user.role).subscribe(data => {
    if(data.success) {
              this.authService.registerUser(user).subscribe(data => {
              if(data.success) {
                this.flashMessage.show('You are now registered and can now login', {cssClass: 'alert-success', timeout: 3000});
                this.router.navigate(['/login']);
              } else {
                this.flashMessage.show('Something went wrong', {cssClass: 'alert-danger', timeout: 3000});
                this.router.navigate(['/register']);
              }
            });
    }
    else {
    this.flashMessage.show('Role already taken', {cssClass: 'alert-danger', timeout: 3000});
    return false;
    }
  });

  }
}
