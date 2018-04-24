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
export class TableService {
  tables: any;

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private httpUtil: HttpUtil,
  ) {}

  list(userId, spaceId) {
    // console.log('Table service.list() --> {userId, spaceId} = ', {userId, spaceId});
    return this.http
      .get(`${this.config.serverurl}${userId}/${spaceId}/table`, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Table service.list() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Table Service.list() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  create(userId, spaceId, tableName) {
    // console.log('Table service.create() --> {userId, spaceId, tableName} = ', {userId, spaceId, tableName});
    return this.http
      .post(`${this.config.serverurl}${userId}/${spaceId}/table`, { tableName }, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Table service.create() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Table Service.create() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  update(userId, spaceId, tableId, tableName) {
    // console.log('Table service.update() --> {userId, spaceId, tableId, tableName} = ', {userId, spaceId, tableId, tableName});
    return this.http
      .put(`${this.config.serverurl}${userId}/${spaceId}/table/${tableId}`, { tableName }, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Table service.update() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Table Service.update() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  delete(userId, spaceId, tableId) {
    // console.log('Table service.delete() --> {userId, spaceId, tableId, tableName} = ', {userId, spaceId, tableId});
    return this.http
      .delete(`${this.config.serverurl}${userId}/${spaceId}/table/${tableId}`, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Table service.delete() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Table Service.delete() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }


}

