import { Component } from '@angular/core';
import { Globals } from './globals';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from '../environments/environment';
import { AlertsService } from './services/alerts.service';

const helper = new JwtHelperService();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  title = 'eb-fe';
  uploadURL: string = "https://storage.googleapis.com/moex-cms-upload/";
  API_URL: string= environment.API_URL;

  constructor(private http: HttpClient, public globals: Globals, public alertsService: AlertsService) { }


  ngOnInit(): void {
    setInterval(() => { this.checkToken(); }, 10 * 60 * 1000); 
  }


  checkToken(): void{
    var token = localStorage.getItem("token");
    if(!token || helper.isTokenExpired(token)) return;
    if((helper.getTokenExpirationDate(token).getTime() - new Date().getTime()) > (15 * 60 * 1000)) return;
    this.http.post(`${this.API_URL}/sessionData/`, {}, { headers: {'Authorization': token}}).toPromise()
    .then(response => {	
      this.globals['token'] = response['token'];
      localStorage.setItem("token", response['token']);
      this.globals.user = helper.decodeToken(response['token']).user;
    });
  }
}
