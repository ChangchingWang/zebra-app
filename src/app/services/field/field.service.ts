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
export class FieldService {


  constructor(
    private http: HttpClient,
    private config: ConfigService,
    private httpUtil: HttpUtil,
  ) {}

  list(userId, spaceId, tableId) {
    // console.log('Field service.list() --> {userId, spaceId, tableId} = ', {userId, spaceId, tableId});
    return this.http
      .get(`${this.config.serverurl}${userId}/${spaceId}/${tableId}/field`, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Field service.list() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Field Service.list() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  create(userId, spaceId, tableId, obj) {
    // console.log('Field service.create() --> {userId, spaceId, tableId, obj} = ', {userId, spaceId, tableId, obj});
    return this.http
      .post(`${this.config.serverurl}${userId}/${spaceId}/${tableId}/field`, obj, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Field service.create() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Field service.create() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  update(userId, spaceId, tableId, fieldId, obj) {
    // console.log('Field service.update() --> {userId, spaceId, tableId, fieldId, obj} = ', {userId, spaceId, tableId, fieldId, obj});
    return this.http
      .put(
        `${this.config.serverurl}${userId}/${spaceId}/${tableId}/field/${fieldId}`,
        obj,
        this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Field service.update() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Field service.update() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }

  delete(userId, spaceId, tableId, fieldId) {
    // console.log('Field service.delete() --> {userId, spaceId, tableId, fieldId} = ', {userId, spaceId, tableId, fieldId});
    return this.http
      .delete(`${this.config.serverurl}${userId}/${spaceId}/${tableId}/field/${fieldId}`, this.httpUtil.getAuthTokenHeaderOptions())
      .map(res  => {
        // console.log('Field service.delete() --> res = ', res);
        return res;
      })
      .catch( (errRes: any) => {
        console.log('Field service.delete() --> ERROR: ', errRes.error);
        throw errRes.error;
      });
  }


}

