import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';
import { ConfigService } from '../config/config.service';
import { HttpUtil } from '../../utils/http.util';

@Injectable()
export class RecordService {

  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private httpUtil: HttpUtil,
  ) {}

  list(userId, spaceId, tableId) {
    // console.log('Record Service.list() --> {userId, spaceId, tableId} = ', {userId, spaceId, tableId});
    return this.http
      .get(`${this.config.serverurl}${userId}/${spaceId}/${tableId}/record`, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Record Service.list() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Record Service.list() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  create(userId, spaceId, tableId, obj) {
    // console.log('Record Service.create() --> {userId, spaceId, tableId, obj} = ', {userId, spaceId, tableId, obj});
    return this.http
      .post(`${this.config.serverurl}${userId}/${spaceId}/${tableId}/record`, obj, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Record Service.create() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Record Service.create() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  update(userId, spaceId, tableId, recordId, obj) {
    // console.log('Record Service.update() --> {userId, spaceId, tableId, recordId, obj} = ', {userId, spaceId, tableId, recordId, obj});
    return this.http
      .put(
        `${this.config.serverurl}${userId}/${spaceId}/${tableId}/record/${recordId}`,
        obj,
        this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Record Service.update() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Record Service.update() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  delete(userId, spaceId, tableId, recordId) {
    // console.log('Record Service.delete() --> {userId, spaceId, tableId, recordId} = ', {userId, spaceId, tableId, recordId});
    return this.http
      .delete(`${this.config.serverurl}${userId}/${spaceId}/${tableId}/record/${recordId}`, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Record Service.delete() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Record Service.delete() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }


}

