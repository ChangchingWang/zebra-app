import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  invalidLogin: boolean;
  errMsg: String;

  isShowLoadiong = false;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const userId = this.authService.getCurrentUser();
      if (userId === 'guest') {
        this.authService.setReadMode(true);
      }
      this.router.navigate(['/home']);
    }
  }

  showLoading(value) {
    this.isShowLoadiong = value;
  }

  logIn(credentials) {
    // console.log('Login Component.logIn() --> ');
    this.authService.logIn(credentials, false).subscribe(
      (userId) => {
        // console.log('login component.logIn() --> userId = ', userId);
        if (userId) {
          this.router.navigate(['/home']);
        } else {
          this.invalidLogin = true;
          this.isShowLoadiong = false;
        }
      },
      (err) => {
        console.log('login component.logIn() --> ERROR: ', err);
        this.invalidLogin = true;
        this.errMsg = err.msg;
        this.isShowLoadiong = false;
      }
    );
  }

  naviateTo(url) {
    this.router.navigate([url]);
  }
}
