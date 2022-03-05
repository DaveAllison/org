import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Event } from '../../../models/event';
import { ActivatedRoute } from '@angular/router';
import { RestService } from "../../../services/rest.service";
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { EventViewModalComponent } from '../event-view-modal/event-view-modal.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
})
export class EventListComponent implements OnInit {

  isPerm: boolean = false;
  events: Event[];
  startDate:string = new Date().toISOString().split('T')[0];
  duration: string = "30";
  minDistance: string = "0";
  maxDistance: string = "1000";
  name: string = null;

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
      this.titleService.setTitle(`Organisers - ${params.type === "P" ? "Permanent" : "Calendar"} Events`);
    });

    
  }

  async getEvents() {
    let params = { 
      eventType: this.activatedRoute.snapshot.paramMap.get("type"),
      duration: this.duration,
      startDate: this.startDate,
      minDistance: this.minDistance,
      maxDistance: this.maxDistance,
      name: this.name ? this.name : ""
    }
    this.events = <Event[]>(await this.rest.get('/eventData/events', params, { 'Authorization': localStorage.getItem("token") }));
  }

  async showEvent(_id) {
    let params = { _id: _id };
    let event = <Event[]>(await this.rest.get('/eventData', params, { 'Authorization': localStorage.getItem("token") }));
    const modalRef = this.modalService.open(EventViewModalComponent, { size: 'xl' });
    modalRef.componentInstance.event = event;
  }

}
