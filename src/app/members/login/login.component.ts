import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient } from '@angular/common/http';
import { Globals } from '../../globals';
import { environment } from '../../../environments/environment';
import { Credential } from '../credential';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  API_URL: string= environment.API_URL;
  credential: Credential;

  constructor(private router: Router, private http: HttpClient, public globals: Globals) { 
    this.credential = { email: null, password:null};
    this.globals['bgImage']="url(https://storage.googleapis.com/moex-cms-upload/images/tandem.jpg)";
  }

  ngOnInit(): void {
    
  }

  onSubmit(): void {

    this.http.post<Credential>(`${this.API_URL}/sessionData/login`, this.credential).subscribe((response)=>{
      localStorage.setItem("token", response['token']);
      this.globals.user = helper.decodeToken(response['token']).user;
      alert("Login succeeded!");
      this.router.navigate(['/events']);
    }, (error)=>{
      alert("login failed");
    });
  }
}