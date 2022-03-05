import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Globals } from '../../globals';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  errorCode: string = "500";
  errorMessage: string = "An error occurred...";
  errorMessages = {
    "401":"Access denied",
    "404":"Page not found"
  };

  constructor(private activatedRoute: ActivatedRoute, public globals: Globals) { 
    this.globals['bgImage']="none";
  }

  ngOnInit(): void {
    this.errorCode = this.activatedRoute.snapshot.paramMap.get("errorCode")
    if(this.errorMessages[this.errorCode]) this.errorMessage = (this.errorMessages[this.errorCode]);
  }

}
