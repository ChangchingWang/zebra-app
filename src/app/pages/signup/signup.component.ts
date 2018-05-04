import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  invalid: boolean;
  errMsg: string;

  isShowLoadiong = false;

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {

  }

  showLoading(value) {
    this.isShowLoadiong = value;
  }

  signUp(credentials) {
    this.authService.signup(credentials).subscribe(
      (userId) => {
        if (userId) {
          this.authService.setReadMode(false);
          this.router.navigate(['/home']);
        } else {
          this.invalid = true;
          this.isShowLoadiong = false;
        }
      },
      (error) => {
        console.log('signup component.signUp() --> ERROR: ', error);
        this.invalid = true;
        this.errMsg = error.msg;
        this.isShowLoadiong = false;
      });
  }

  naviateTo(url) {
    this.router.navigate([url]);
  }
}
