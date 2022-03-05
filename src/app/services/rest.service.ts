import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Globals } from '../globals';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  API_URL: string= environment.API_URL;

  constructor(private http: HttpClient, public globals: Globals) { }

  async get(path, params, headers) {
    try {
      this.globals.spinner = true;
      let response = await this.http.get(`${this.API_URL}${path}`, { params: params, headers: headers }).toPromise();
      return response;
    }
    catch(e){
      throw(e);
    }
    finally{
      this.globals.spinner = false;
    }
  }

  async post(path, body, headers) {
    try {
      this.globals.spinner = true;
      let response = await this.http.post(`${this.API_URL}${path}`, body, {headers: headers}).toPromise();
      return response;
    }
    catch(e){
      throw(e);
    }
    finally{
      this.globals.spinner = false;
    }
  }
}
