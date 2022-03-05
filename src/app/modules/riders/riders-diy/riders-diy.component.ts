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
  selector: 'app-riders-diy',
  templateUrl: './riders-diy.component.html'
})
export class RidersDiyComponent implements OnInit {

  riders: any;
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
      this.myEvents = await this.rest.get('/eventData/eventList', { eventType: "D" }, { 'Authorization': localStorage.getItem("token") });
      this.myEvents.splice(0, 0, {_id:0, name:"All"});
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async getRiders() {
    try {
      let params = {eventType:"D"};
      if(this.selectedEventId !== 0) params['eventId'] = this.selectedEventId;
      if(this.selectedMemberId) params['memberId'] = this.selectedMemberId;
     
      if (this.selectedStatus && this.selectedStatus !== 'all') params['status'] = this.selectedStatus;
      this.riders = await this.rest.get('/riderData/list', params, { 'Authorization': localStorage.getItem("token") });
      for (let rider of this.riders){
        rider.rideTimeStr = this.timeToString(rider.rideTime);
      }
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async save(index) {
    this.riders[index].rideTime = this.timeToInt(this.riders[index].rideTimeStr); 
    try {
      await this.rest.post('/riderData', this.riders[index], { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Rider record updated", { classname: 'bg-success text-light', delay: 3000 });
      this.riders[index].changed = false;
    }
    catch(e){
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

  async labels() {

    try {
      let data:any = await this.rest.post('/pdf', {controlData: this.riders}, {accept:'application/pdf'});
      
      var url = "data:application/pdf;base64," + data.data;

      fetch(url)
        .then(res => res.blob())
        .then(res => {
          let blobURL = URL.createObjectURL(res);
          window.open(blobURL);
        });
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
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

