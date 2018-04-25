import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-front',
  templateUrl: './front.component.html',
  styleUrls: ['./front.component.css']
})
export class FrontComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getCurrentUser();
      this.router.navigate(['/home']);
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  signup() {
    this.router.navigate(['/signup']);
  }

  loginWithGuest() {
    const credentials = {
      userId: 'guest',
      password: 'guest'
    };
    // console.log('Front Component.loginWithGuest() --> ');
    this.authService.logIn(credentials, true).subscribe(
      (userId) => {
        // console.log('Front Component.loginWithGuest() --> userId = ', userId);
        if (userId) {
          this.router.navigate(['/home']);
        } else {
          console.log('Front Component.loginWithGuest() --> Unknown error.');
        }
      },
      (err) => {
        console.log('Front Component.loginWithGuest() --> ERROR: ', err);
      }
    );
  }

}