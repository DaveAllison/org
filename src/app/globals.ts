import { Injectable } from "@angular/core";


@Injectable()
export class Globals {
  exp: number;
  iat: number;
  user: {  
    _id: number,
    householdId: number,
    firstName: string,
    lastName: string,
    groups: string[],
    adminGroup: string
  };
  spinner: boolean = false;

  bgImage: string = "none";
  bgText: string = null;
}