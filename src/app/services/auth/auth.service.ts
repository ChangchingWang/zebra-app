import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../config/config.service';
import { ReplaySubject } from 'rxjs/RX';

@Injectable()
export class AuthService {
  // Ivan001
  currentUserId: any;
  readMode: boolean;

  constructor(
    private http: HttpClient,
    private config: ConfigService) {
    const token = localStorage.getItem('token');
    if (token) {
      const jwt = new JwtHelper();
      this.currentUserId = jwt.decodeToken(token).userId;
    }
  }

  setReadMode(value) {
    this.readMode = value;
  }

  logIn(credentials, readMode) {
    // console.log('Auth Service.logIn() --> ');
    return this.http
      .post(this.config.serverurl + 'auth', credentials)
      .map((resObj: any) => {
        // console.log('Auth Service.logIn() --> resObj = ', resObj);
        const token = resObj.token;
        const userId = resObj.userId;
        // console.log('token = ', token);
        // console.log('userId = ', userId);

        localStorage.setItem('token', token);
        this.readMode = readMode;
        this.currentUserId = resObj.userId;
        // console.log('authService.login() --> currentUser = ', this.currentUser);
        return resObj.userId;
      })
      .catch( (errRes) => {
        console.log('auth serivice.login() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  signup(user) {
    return this.http
      .post(this.config.serverurl + 'user', user)
      .map( (resObj: any) => {
        const token = resObj.token;
        const userId = resObj.userId;
        // console.log('SIGNUP --> token = ', token);
        // console.log('SIGNUP --> userId = ', userId);

        localStorage.setItem('token', token);

        this.currentUserId = resObj.userId;
        // console.log('authService.signup() --> currentUser = ', this.currentUser);
        return resObj.userId;
      })
      .catch( (errRes) => {
        console.log('auth serivice.signup() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserId = null;
  }

  isLoggedIn(): boolean {
    return tokenNotExpired('token');
  }

  getCurrentUser(): string {
    return this.currentUserId;
  }

  getToken(): string {
    return localStorage.getItem('token');
  }

  isReadMode() {
    return this.readMode;
  }
}

