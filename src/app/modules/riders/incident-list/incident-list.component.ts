import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router"
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { RefDataService } from '../../../services/refData.service';
import { RestService } from '../../../services/rest.service';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { AlertsService } from '../../../services/alerts.service';
import { IncidentModalComponent } from '../incident-modal/incident-modal.component';

@Component({
  selector: 'app-incident-list',
  templateUrl: './incident-list.component.html',
  styleUrls: ['./incident-list.component.css']
})
export class IncidentListComponent implements OnInit {

  myEvents: any = [];
  selectedEventId: string = null;
  incidents: any;

  constructor(public globals: Globals, private router: Router, public alertsService: AlertsService, public refDataService: RefDataService, private rest: RestService, private titleService: Title, private modalService: NgbModal) { 
    this.titleService.setTitle('Organisers - Event Admin');
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {

    try {

      this.myEvents = await this.rest.get('/eventData/eventList', null, { 'Authorization': localStorage.getItem("token") });
      if(this.myEvents.length === 1) { // Safari browser does not allow selection if only one event in list
        this.selectedEventId = this.myEvents[0]._id;
        this.getIncidents();
      }
    }
    catch (e) {
      console.log(e);
      this.alertsService.show(e.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async getIncidents() {
    this.incidents = await this.rest.get('/incidentData/list', { eventId: this.selectedEventId }, { 'Authorization': localStorage.getItem("token") });
  }

  addIncident() {
    let incident = {_id: 0, eventId: this.selectedEventId, incidentDate: new Date(), summary: "Please add an incident summary", severity: "Minor"}
    this.incidents.push(incident);
    this.showIncident(incident);
  }

  showIncident(incident) {
    
    const modalRef = this.modalService.open(IncidentModalComponent, { size: 'xl' });
    modalRef.componentInstance.incident = incident;
  }

}
