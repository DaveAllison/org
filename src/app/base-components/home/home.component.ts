import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { environment } from '../../../environments/environment';
import { Globals } from '../../globals';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

  STORAGE_URL: string= environment.STORAGE_URL;

  constructor(public globals: Globals, private router: Router,) { 
    this.globals['bgImage'] = `url(${this.STORAGE_URL}/images/lwl-brevet-cards.jpg)`;
    this.globals['bgText'] = "Photo: Brevet Cards - LWL";
  }

  ngOnInit(): void {
    this.globals['spinner'] = false;
  }

}
