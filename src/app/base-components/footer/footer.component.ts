import { Component, OnInit } from '@angular/core';
import { Globals } from '../../globals';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  uploadURL: string = "https://storage.googleapis.com/moex-cms-upload/";
  thisYear: number = new Date().getFullYear();

  constructor(public globals: Globals,) { }

  ngOnInit(): void {
  }

}
