import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../config/config.service';
import { HttpUtil } from '../../utils/http.util';

@Injectable()
export class SpaceService {
  private space: any; // used when navigate from home to space

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private httpUtil: HttpUtil,
  ) {}

  setSpace(space) {
    this.space = space;
  }

  getSpace() {
    return this.space;
  }

  list(userId) {
    // console.log('Space Service.list() --> userId = ', userId);
    return this.http
      .get(this.config.serverurl + userId + '/space', this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Space Service.list() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Space Service.list() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  create(userId, obj) {
    // console.log('Space Service.create() --> obj = ', obj);
    return this.http
      .post(this.config.serverurl + userId + '/space', obj, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Space Service.create() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Space Service.create() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  update(userId, spaceId, obj) {
    // console.log('Space Service.update() --> obj = ', obj);
    return this.http
      .put(`${this.config.serverurl}${userId}/space/${spaceId}`, obj, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Space Service.update() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Space Service.update() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  delete(userId, spaceId) {
    // console.log('Space Service.delete() --> {userId, spaceId} = ', {userId, spaceId});
    return this.http
      .delete(`${this.config.serverurl}${userId}/space/${spaceId}`, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Space Service.delete() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Space Service.delete() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }


}

