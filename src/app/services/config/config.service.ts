import { Injectable } from '@angular/core';

@Injectable()
export class ConfigService {
  _serverurl = 'http://localhost:3000/';
  // _serverurl = 'https://zebra-service.herokuapp.com/';
  constructor() { }

  get serverurl() {
    return this._serverurl;
  }
}
