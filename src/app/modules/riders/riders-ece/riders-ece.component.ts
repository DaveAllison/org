import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { RefDataService } from '../../../services/refData.service';
import { RestService } from '../../../services/rest.service';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { AlertsService } from '../../../services/alerts.service';
import { NgControlStatus } from '@angular/forms';

@Component({
  selector: 'app-riders-ece',
  templateUrl: './riders-ece.component.html'
})
export class RidersEceComponent implements OnInit {

  riders: any;
  myEvents: any = [];
  selectedStatus: string = 'Entered';
  selectedFromDate: string=null;
  selectedToDate: string = null;
  //approvalStatuses: string[] = ['Entered', 'Finished', 'Did not start', 'Did not finish'];
  

  API_URL: string = environment.API_URL;

  constructor(private modalService: NgbModal, public globals: Globals, public alertsService: AlertsService, public refDataService: RefDataService, private rest: RestService ) {
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    this.getRiders();
  }

  async getRiders() {
    try {
      let params = { eceStatus:this.selectedStatus };
      if(this.selectedFromDate) params['fromDate'] = this.selectedFromDate;
      if(this.selectedToDate) params['fromDate'] = this.selectedToDate;
      this.riders = await this.rest.get('/riderData/listECE', params, { 'Authorization': localStorage.getItem("token") });
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async save(index) {
    //this.riders[index].rideTime = this.timeToInt(this.riders[index].rideTimeStr); 
    try {
      await this.rest.post('/riderData/ece', this.riders[index], { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Rider record updated", { classname: 'bg-success text-light', delay: 3000 });
      this.riders[index].changed = false;
    }
    catch(e){
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
    }
    
  }

  download() {
    let finishers="eventId,memNum,memName,startDate,startTime,finishDate,finishTime,status\n"
    for (let event of this.riders){
      let startDateTime = event['controls'][0]['arrivalDateTime'];
      let arrivalDateTime = event['controls'][event['controls'].length - 1]['arrivalDateTime'];
      let finisher = [event.sourceId, event.memNum, event.memName, new Date(startDateTime).toLocaleString(), new Date(arrivalDateTime).toLocaleString(), event.status];
      finishers = finishers + (finisher.join(",")) + "\n";
    }
    var blob = new Blob([finishers], {type: "text/csv;charset=utf-8"});
    saveAs(blob, "finishers.csv");
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
      return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
    else return "00:00:00";
  }

  timeToInt(rideTimeStr) : number {
    
    if(rideTimeStr) {
      let rideTimeArr = rideTimeStr.split(":");
      return (parseInt(rideTimeArr[0], 10)*24*60 + parseInt(rideTimeArr[1], 10)*60 + parseInt(rideTimeArr[2], 10));
    }
    else return 0;
  }


}

