import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals';
import { Router } from "@angular/router";
import { AlertsService } from '../../services/alerts.service';
import { JwtHelperService } from "@auth0/angular-jwt";

const helper = new JwtHelperService();

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {

  menuClass: string ="collapse navbar-collapse";
  isCollapsed: boolean = true;
  uploadURL: string = "https://storage.googleapis.com/moex-cms-upload/";
  isAdmin: boolean = false;

  constructor(private router: Router, public globals: Globals, public alertsService: AlertsService) { }

  ngOnInit(): void {
    var token = localStorage.getItem("token");
    if(token !== null && !helper.isTokenExpired(token)) this.globals.user = helper.decodeToken(token).user;
    else this.globals.user._id = null;
    if(this.globals.user && this.globals.user.groups.some( x => ['cal-admin', 'perm-admin'].includes(x))) this.globals.user.isAdmin = true;
    
    console.log(this.globals);
  }

  login(): boolean{
   
    if(this.globals.user){
      localStorage.removeItem("token");
      this.globals.user = null;
      this.alertsService.show("Logout successful", { classname: 'bg-success text-light', delay: 3000 });
      this.router.navigate(['/auklogin']);
      return false;
    }
    else {
      this.router.navigate(['/auklogin']);
      return false;
    }
  }

  toggleMenu(): void{
    this.isCollapsed = !this.isCollapsed;
  }



}
