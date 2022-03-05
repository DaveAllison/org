import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  getUser(){
    let token = localStorage.getItem("token");
    if(!token || helper.isTokenExpired(token)) return null;
    else return helper.decodeToken(token).user;
  }
}
