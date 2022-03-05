import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Globals } from '../globals';

@Injectable({
  providedIn: 'root'
})
export class FinisherGuard implements CanActivate {

  constructor(private router: Router, private globals: Globals) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      //if(!this.globals.user || !this.globals.user.groups.some(r=> ['event-director', 'validator', 'editors'].includes(r))){
      //  alert("Only administrators can view finisher details. You must be logged in");
      //  this.router.navigate(['/events']);
      //  return false;
      //}
      return true;
  }
  
}