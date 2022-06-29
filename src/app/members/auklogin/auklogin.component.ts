import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Globals } from '../../globals';
import { environment } from '../../../environments/environment';
import { Credential } from '../credential';
import { AlertsService } from '../../services/alerts.service';
import { RestService } from '../../services/rest.service';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Component({
  selector: 'app-auklogin',
  templateUrl: './auklogin.component.html'
})
export class AukloginComponent implements OnInit {

  API_URL: string = environment.API_URL;
  STORAGE_URL: string= environment.STORAGE_URL;
  credential: Credential;


  constructor(private router: Router, public globals: Globals, public alertsService: AlertsService, private rest: RestService) {
    this.credential = { email: null, password: null };
    this.globals['bgImage'] = `url(${this.STORAGE_URL}/images/lwl-brevet-cards.jpg)`;
    this.globals['bgText'] = "Photo: NCR 81 through the Elan Valley by Lee Killestein";
  }

  ngOnInit(): void {
    this.globals['spinner'] = false;
  }

  async onSubmit() {

    try {
      this.credential.email = this.credential.email.toLowerCase(); // AUK emails ares stored as lower case
      let response = await this.rest.post('/login', this.credential, null);

      response = await this.rest.post('/sessionData/orgCheck', null, { 'Authorization': response['token'] });

      localStorage.setItem("token", response['token']);
      this.globals.user = helper.decodeToken(response['token']).user;
      if(this.globals.user.groups.some( x => ['cal-admin', 'perm-admin'].includes(x))) this.globals.user.isAdmin = true;

      console.log(this.globals.user);
      this.alertsService.show("Login succeeded!", { classname: 'bg-success text-light', delay: 3000 });
      this.router.navigate(['/organisers/dashboard']);
    }
    catch (error) {

      console.log(error);
      this.alertsService.show("Login failed!", { classname: 'bg-danger text-light', delay: 3000 });
    }
  }
}