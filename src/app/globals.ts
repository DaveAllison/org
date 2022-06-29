import { Injectable } from "@angular/core";


@Injectable()
export class Globals {
  exp: number;
  iat: number;
  user: {  
    _id: number,
    firstName: string,
    lastName: string,
    groups: string[],
    adminGroup: string,
    region: string,
    isAdmin: boolean
  };

  spinner: boolean = false;

  bgImage: string = "none";
  bgText: string = null;
}