import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  invalid: boolean;
  errMsg: string;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  signUp(credentials) {
    this.authService.signup(credentials).subscribe(
      (userId) => {
        if (userId) {
          this.authService.setReadMode(false);
          this.router.navigate(['/home']);
        } else {
          this.invalid = true;
        }
      },
      (error) => {
        console.log('signup component.signUp() --> ERROR: ', error);
        this.invalid = true;
        this.errMsg = error.msg;
      });
  }

  naviateTo(url) {
    this.router.navigate([url]);
  }
}
