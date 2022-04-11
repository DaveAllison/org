import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { RestService } from '../../../services/rest.service';
import { RefDataService } from '../../../services/refData.service';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { AlertsService } from '../../../services/alerts.service';
import { NgControlStatus } from '@angular/forms';

@Component({
  selector: 'app-validate',
  templateUrl: './validate.component.html',
  styleUrls: ['./validate.component.css']
})
export class ValidateComponent implements OnInit {

  riders: any;
  filteredRiders: any;
  riderFilter: string = "";
  myEvents: any = [];
  selectedEventId: number = 0;;
  selectedMemberId: number = null;
  selectedStatus: string = 'all';
  selectedDistance: number = 0;


  constructor(private modalService: NgbModal, public globals: Globals, public alertsService: AlertsService, public refData: RefDataService, private rest: RestService ) {
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    try {
      this.myEvents = await this.rest.get('/eventData/eventList', { eventType: "C", screen: "validation" }, { 'Authorization': localStorage.getItem("token") });
      this.myEvents.splice(0, 0, {_id:0, name:"All"});
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async getRiders() {
    try {
      let params = {};
      if(this.selectedEventId !== 0) params['eventId'] = this.selectedEventId;
      if(this.selectedMemberId) params['memberId'] = this.selectedMemberId;
     
      if (this.selectedStatus && this.selectedStatus !== 'all') params['status'] = this.selectedStatus;
      this.riders = await this.rest.get('/riderData/list', params, { 'Authorization': localStorage.getItem("token") });
      for (let rider of this.riders){
        rider.rideTimeStr = this.timeToString(rider.rideTime);
      }
      this.filterRiders();
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  filterRiders(){
    this.filteredRiders = this.riders.filter(x => x.name.search(this.riderFilter) !== -1);
  }

  async validate(index, validate) {
    let params = {
      validate: validate,
      rider: this.filteredRiders[index]
    }
    try {
      let result = await this.rest.post('/riderData/validate', params, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Rider record updated", { classname: 'bg-success text-light', delay: 3000 });
      this.filteredRiders[index].status = result['status'];
      this.filteredRiders[index].aukValidationId = result['aukValidationId'];
      this.filteredRiders[index].acpValidationId = result['acpValidationId'];
    }
    catch(e){
      console.log(e);
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
    }
    
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

  

  changed(index){
    this.riders[index].changed = true;
  }

  timeToString(rideTime) : string {
    if(rideTime){
      let days = Math.round(rideTime/(24*60));
      let hours = Math.round((rideTime%(24*60))/60);
      let mins = rideTime%60;
      return `${days.toString().padStart(1, '0')}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
    else return "0:00:00";
  }

  timeToInt(rideTimeStr) : number {
    
    if(rideTimeStr) {
      let rideTimeArr = rideTimeStr.split(":");
      return (parseInt(rideTimeArr[0], 10)*24*60 + parseInt(rideTimeArr[1], 10)*60 + parseInt(rideTimeArr[2], 10));
    }
    else return 0;
  }


}


