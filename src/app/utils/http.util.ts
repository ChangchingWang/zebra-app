import { Injectable } from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { AuthService } from '../services/auth/auth.service';

@Injectable()
export class HttpUtil {

  constructor(private authService: AuthService) { }

  getAuthTokenHeaderOptions() {
    const token = this.authService.getToken();
    return {
      headers: new HttpHeaders({
        'x-auth-token': token
      })
    };
  }
}
