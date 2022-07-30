import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Title } from '@angular/platform-browser';
import { saveAs } from 'file-saver';
import { RestService } from '../../../services/rest.service';
import { RefDataService } from '../../../services/refData.service';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { AlertsService } from '../../../services/alerts.service';
import { NgControlStatus } from '@angular/forms';

@Component({
  selector: 'app-calendar-validate',
  templateUrl: './calendar-validate.component.html',
  styleUrls: ['./calendar-validate.component.css']
})
export class CalendarValidateComponent implements OnInit {

  riders: any;
  filteredRiders: any;
  riderFilter: string = "";
  myEvents: any = [];
  selectedEvent: any = null;
  selectedEventId: number = 0;;
  selectedMemberId: number = null;
  selectedStatus: string = 'all';
  selectedDistance: number = 0;
  allRidersUpdated: boolean = true;

  constructor(private modalService: NgbModal, public globals: Globals, private titleService: Title, public alertsService: AlertsService, public refData: RefDataService, private rest: RestService ) {
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    this.titleService.setTitle('Organisers - Validation');
    try {
      this.myEvents = await this.rest.get('/eventData/eventList', { eventType: "C", screen: "validation" }, { 'Authorization': localStorage.getItem("token") });
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async getRiders() {
    try {
      this.allRidersUpdated = false;
      let params = {eventId: this.selectedEvent._id};
      //if(this.selectedEventId !== 0) params['eventId'] = this.selectedEventId;
      //if(this.selectedMemberId) params['memberId'] = this.selectedMemberId;
     
      if (this.selectedStatus && this.selectedStatus !== 'all') params['status'] = this.selectedStatus;
      this.riders = await this.rest.get('/riderData/list', params, { 'Authorization': localStorage.getItem("token") });
      for (let rider of this.riders){
        rider.name = `${rider.firstname} ${rider.surname}`
      }
      this.filterRiders();
      this.allRidersUpdated = this.checkAllValidated();
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  filterRiders(){
    this.filteredRiders = this.riders.filter(x => x.name.toLowerCase().search(this.riderFilter.toLowerCase()) !== -1 );
  }

  async validate(rider, validate) {
    let params = {
      validate: validate,
      rider: rider
    }
    try {
      let result = await this.rest.post('/riderData/validate', params, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Rider record updated", { classname: 'bg-success text-light', delay: 3000 });
      rider.status = result['status'];
      rider.aukValidationId = result['aukValidationId'];
      rider.acpValidationId = result['acpValidationId'];
      this.allRidersUpdated = this.checkAllValidated();
    }
    catch(e){
      console.log(e);
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
    }
    
  }

  async validateAll(){
    for (let rider of this.riders){
      await this.validate(rider, true);
    }
    this.allRidersUpdated = this.checkAllValidated();
  }

  checkAllValidated(): boolean {
    return (!this.riders.some(x => this.refData.completedEntryStatuses().indexOf(x.status) === -1));
  }

  download() {
    let downloadRiders="eventId,memberId,name,email,status\n"
    for (let rider of this.riders){
      let downloadRider = [rider.eventId, rider.memberId, rider.name, rider.email, rider.status];
      downloadRiders = downloadRiders + (downloadRider.join(",")) + "\n";
    }
    var blob = new Blob([downloadRiders], {type: "text/csv;charset=utf-8"});
    saveAs(blob, "downloadRiders.csv");
  }

  async closeEvent(){
    try {
      let params = {
        eventId: this.selectedEvent._id,
        status: 'Closed'
      };

      await this.rest.post('/eventData/status', params, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Event status updated", { classname: 'bg-success text-light', delay: 3000 });
      this.selectedEvent.eventStatus = 'Closed'
    }
    catch(e){
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  

 

}


