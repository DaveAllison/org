import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../../services/rest.service';
import { RefDataService } from '../../../services/refData.service';
import { AlertsService } from '../../../services/alerts.service';
import { environment } from '../../../../environments/environment';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-incident-modal',
  templateUrl: './incident-modal.component.html',
  styleUrls: ['./incident-modal.component.css']
})
export class IncidentModalComponent implements OnInit {

  @Input()
  incident:any;
  incidentDate:string;
  notes:any;
  newNote:string;

  constructor(public globals: Globals, public activeModal: NgbActiveModal, public alertsService: AlertsService, public refData: RefDataService, private rest: RestService) { 
    this.globals['bgImage'] = "none";
  }

  async ngOnInit() {
      let dateTimeString = new Date(this.incident.incidentDate).toLocaleString("en-GB", { timeZone: 'Europe/London' });
      this.incidentDate = `${dateTimeString.substring(6,10)}-${dateTimeString.substring(3,5)}-${dateTimeString.substring(0,2)}`;
  }

  async save(){

    try {
      this.incident.incidentDate = new Date(this.incidentDate + "T" + "00:00:00");
      
      let result = await this.rest.post('/incidentData', this.incident, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show(`Incident updated`, { classname: 'bg-success text-light', delay: 3000 });
      this.incident._id = this.incident._id === 0 ? result['_id'] : this.incident._id;
      
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }

    //this.activeModal.dismiss();
  }

  setDescription(){
    if(this.incident.severity === 'Nil Return') this.incident.summary = "No incidents to report";
    else this.incident.summary = null;
  }

  async addNote(){

    try {
      let params = {
        incidentId: this.incident._id,
        noteDate: new Date(),
        note: this.newNote
      }
      
      await this.rest.post('/incidentData/note', params, { 'Authorization': localStorage.getItem("token") });
      this.notes.push(params);
      this.newNote = null;
      
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }

  }

}
