import { Component, OnInit } from '@angular/core';
import { RestService } from "../../../services/rest.service";
import { Title } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { Event } from '../../../models/event';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  event: Event;
  events: any = [];
  allEvents: any = [];
  filteredEvents: any = [];

  notes: any=[];
  allNotes: any = [];
  filteredNotes: any = [];
  notesOffset: number = 0;
  //orgFilter: string = '';
  //regions: any = [ "South-East", "South-West", "North-West", "North-East", "Scotland"];
  params = {
    //region: "South-East",
    restartId: "0"
  };
  isAdmin: boolean = false;
  isMentor: boolean = false;
  needReview: boolean = true;
  myEvents: boolean = true;
  myEventNotes: boolean = true;
  nameFilter: string = '';
  noteFilter: number = null;

  constructor(private router: Router, private rest: RestService, private modalService: NgbModal, private titleService: Title, private globals: Globals, private alertsService: AlertsService) { 
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Organisers - Dashboard');
   
    if (this.globals.user.groups.some( x => ['cal-admin', 'perm-admin'].includes(x))) {
      this.isAdmin = true;
      this.myEvents = false;
    }
    if (this.globals.user.groups.includes('mentor')) {
      this.isMentor = true;
      this.myEvents = false;
    }
    this.getEvents(false); // *** Make these two calls into a single promise ***
    this.getNotes(false)
  }

  async getEvents(more) {
    try {
      if(!more) this.params.restartId = "0"

      let response = <any[]>(await this.rest.get('/eventData/eventList', {region: this.globals.user.region, myEvents: this.myEvents}, {'Authorization': localStorage.getItem("token")}));
      if(more && Object.keys(response).length === 0) throw ({error:{message : "No more events found"}}); // NB don't know that we have returned an array so can't test length
      this.allEvents = more ? this.allEvents.concat(response) : response;
      if(this.allEvents.length === 0) throw ({error:{message : "No events found"}});
      this.params.restartId = this.allEvents[this.allEvents.length - 1]._id.toString();
      this.filterEvents();
    }
    catch(e){
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
      console.log(e);
    }
  }

  async getNotes(more) {
    try {
      if(!more) this.params.restartId = "0"

      let response = <any[]>(await this.rest.get('/eventData/notes', {region: this.globals.user.region, myEventNotes: this.myEventNotes, offset: more ? this.allNotes.length : 0}, {'Authorization': localStorage.getItem("token")}));
      if(more && Object.keys(response).length === 0) throw ({error:{message : "No more notes found"}}); // NB don't know that we have returned an array so can't test length
      this.allNotes = more ? this.allNotes.concat(response) : response;
      if(this.allNotes.length === 0) throw ({error:{message : "No notes found"}});
      this.params.restartId = this.allNotes[this.allNotes.length - 1]._id.toString();
      this.filterNotes();
    }
    catch(e){
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
      console.log(e);
    }
  }

  filterEvents(): void {

    this.filteredEvents = this.allEvents.filter(x => {
      if (!this.needReview) return true;
      else if( x.eventStatus !== x.eventRequestedStatus) return true;
      return false;
    });

    let r = new RegExp(this.nameFilter, "i");
    this.filteredEvents = this.filteredEvents.filter(x => (x.name && x.name.match(r)) || x.adminGroup && x.adminGroup.match(r));
    
  }

  filterNotes(): void {
    console.log(`Note filter: ${this.noteFilter}`);
    if(!this.noteFilter) this.filteredNotes = this.allNotes;
    this.filteredNotes = this.allNotes.filter(x => {
      if(!this.noteFilter) return true;
      return (x.eventId === this.noteFilter );
    });
  }

  formatDateAndTime(d): string{
    let dateTimeString = new Date(d).toLocaleString("en-GB", { timeZone: 'Europe/London' });
    return `${dateTimeString.substring(6,10)}-${dateTimeString.substring(3,5)}-${dateTimeString.substring(0,2)} ${dateTimeString.substring(12,17)}`;
       
  }

  async addEvent() {
  
    this.event = {
      _id: 0,
      aaaPoints: 0,
      aukPoints: 0,
      body: 'Audax UK',
      category: 'BP',
      climb: 0,
      description: 'Sample event',
      distance: 0,
      eventDate: null,
      entryOpenDate: null,
      entryCloseDate: null,
      maxRiders: 999,
      eventType: "P",
      postalFee: 0,
      onlineFee: 0,
      paymentMethod: 'Both',
      maxSpeed: 0,
      minSpeed: 0,
      name: "Template Event",
      primaryOrganiserId: this.globals.user._id,
      adminGroup: this.globals.user.adminGroup,
      reversible: false,
      altStart: false,
      flexStart: false,
      eventStatus: 'Project',
      eventRequestedStatus: 'Project',
      start: {
        description: null,
        latitude: 51.47432,
        longitude: 0.00001
      },
      facilityCamping: false,
      facilityToilets: false,
      facilityGPS: false,
      facilityLuggage: false,
      facilityMudguards: false,
      facilityParking: false,
      facilityRefreshmentsStart: false,
      facilityXRate: false,
      trackFileURL: null,
      routeFileURL: null,
      controls: [
        {
          name: "New control",
          latitude: 51.47432,
          longitude: 0.00001,
          distance: 0,
          proximity: 0.5,
          infoQuestion: null,
          infoAnswer: null
        }
      ],
      registrationFeePaid: false,
      registrationOrderId: null
    }
    try {
      let result = await this.rest.post('/eventData', this.event, { 'Authorization': localStorage.getItem("token") });
      this.event._id = result['_id'];
      this.alertsService.show(`Event record ${this.event._id} created. Select from your event list below to edit it`, { classname: 'bg-success text-light', delay: 3000 });
      this.allEvents.push({
        _id: this.event._id,
        name: this.event.name,
        adminGroup: this.event.adminGroup,
        eventDate: this.event.eventDate,
        eventStatus: this.event.eventStatus,
        eventRequestedStatus: this.event.eventRequestedStatus
      });
      this.needReview = false;
      this.filterEvents();
    }
    catch (e) {
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
      return;
    }
  
  }

}
