import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Event } from '../../models/event';
import { ActivatedRoute } from '@angular/router';
import { RestService } from "../../services/rest.service";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../globals';
import { environment } from '../../../environments/environment';
import { EventViewComponent } from '../event-view-modal/event-view-modal.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
})
export class EventsComponent implements OnInit {

  isPerm: boolean = false;
  events: Event[];
  startDate:string = new Date().toISOString().split('T')[0];
  duration: string = "30";
  minDistance: string = "0";
  maxDistance: string = "1000";
  name: string = null;
  isEbApproved: boolean = true;

  API_URL: string= environment.API_URL;


  constructor(private rest: RestService, private titleService: Title, private activatedRoute: ActivatedRoute, private modalService: NgbModal, public globals: Globals) { 
    this.globals.bgImage = "none";
    this.globals['bgText'] = null;
  }

  ngOnInit(): void {
    // need to listen for route events, otherwise won't detect change from calendar to perm search
    this.activatedRoute.params.subscribe(params => {
      this.isPerm = (params.type === "P");
      this.events = [];
      //this.titleService.setTitle(`NFA - ${params.type === "P" ? "Permanent" : "Calendar"} Events`);
    });

    
  }

  async getEvents() {
    let params = { 
      eventType: this.activatedRoute.snapshot.paramMap.get("type"),
      duration: this.duration,
      startDate: this.startDate,
      minDistance: this.minDistance,
      maxDistance: this.maxDistance,
      name: this.name ? this.name : "",
      ebApproved : this.isEbApproved
    }
    this.events = <Event[]>(await this.rest.get('/eventData', params, null));
  }

  showEvent(event): void{
    const modalRef = this.modalService.open(EventViewComponent, { size: 'xl' });
    modalRef.componentInstance.event = event;
  }

}

