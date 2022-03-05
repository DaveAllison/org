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
    this.globals['bgImage'] = `url(${this.STORAGE_URL}/images/elan-valley-200809-reduced.jpg)`;
    this.globals['bgText'] = "Photo: NCR 81 through the Elan Valley by Lee Killestein";
  }

  ngOnInit(): void {
    this.globals['spinner'] = false;
  }

}
