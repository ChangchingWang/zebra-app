import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalidLogin: boolean;
  errMsg: String;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  logIn(credentials) {
    // console.log('Login Component.logIn() --> ');
    this.authService.logIn(credentials, false).subscribe(
      (userId) => {
        // console.log('login component.logIn() --> userId = ', userId);
        if (userId) {
          this.router.navigate(['/home']);
        } else {
          this.invalidLogin = true;
        }
      },
      (err) => {
        console.log('login component.logIn() --> ERROR: ', err);
        this.invalidLogin = true;
        this.errMsg = err.msg;
      }
    );
  }

  naviateTo(url) {
    this.router.navigate([url]);
  }
}
