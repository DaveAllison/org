import { Component, OnInit } from '@angular/core';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html'
})
export class DownloadComponent implements OnInit {

  STORAGE_URL: string= environment.STORAGE_URL;

  constructor(public globals: Globals) { 
    this.globals['bgImage']=`url(${this.STORAGE_URL}/images/tandem.jpg)`;
    this.globals['bgText'] = "Photo: Caroline Fenton";
  }

  ngOnInit(): void {
  }

}
