import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../services/alerts.service';
import { RestService } from '../../../services/rest.service';
import { RefDataService } from '../../../services/refData.service';
import { Globals } from '../../../globals';
import { saveAs } from 'file-saver';
import { RiderDetailsModalComponent } from '../rider-details-modal/rider-details-modal.component';
import { RiderAddModalComponent } from '../rider-add-modal/rider-add-modal.component';
import { getLocaleExtraDayPeriodRules } from '@angular/common';

const permittedFileTypes = {
  finishers: [ 'csv' ]
};
const maxFileSize = 2;
const statusMap = {
  e: "Entered",
  f: "Finished",
  ns: "Did not start",
  nf: "Did not finish"
}

@Component({
  selector: 'app-calendar-list',
  templateUrl: './calendar-list.component.html',
  styleUrls: ['./calendar-list.component.css']
})
export class CalendarListComponent implements OnInit {

  finisherView: boolean = false;
  riders: any;
  selectedEvent: any = null;
  selectedRider: any = null;
  eventInFuture: boolean = false;
  filteredRiders: any;
  myEvents: any = [];
  riderFilter: string = "";
  showUploadScreen: boolean = false;
  uploadFile: Object = { finishers: null };
  uploadBuffer: Object = { finishers: null};
  uploadErrors: string[] = [];
  allRidersUpdated: boolean = false;

  constructor(public globals: Globals, public alertsService: AlertsService, private rest: RestService, public refDataService: RefDataService, private modalService: NgbModal) { 
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    try {
      this.myEvents = await this.rest.get('/eventData/eventList', { target: "riderList", eventType: "C" }, { 'Authorization': localStorage.getItem("token") });
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async getRiders() {
    try {
      if(!this.selectedEvent) this.riders = {};
      else {
        this.eventInFuture = false;
        this.allRidersUpdated = false;
        if(new Date(this.selectedEvent.eventDate) > new Date()) this.eventInFuture = true;
        let params = {eventId: this.selectedEvent._id};
        this.riders = await this.rest.get('/riderData/list', params, { 'Authorization': localStorage.getItem("token") });
        for (let rider of this.riders){
          rider.name = `${rider.firstname} ${rider.surname}`
          this.setRideTime(rider, rider.rideTime);
          rider.changed = false;
        }
        this.filterRiders();
        this.allRidersUpdated = this.checkComplete();
      }
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  isJunior(rider): boolean {
    let d = new Date(rider.dateOfBirth);
    d.setFullYear(d.getFullYear() + 18);
    return d > new Date();
  }

  filterRiders(){
    this.filteredRiders = this.riders.filter(x => x.name.toLowerCase().search(this.riderFilter.toLowerCase()) !== -1);
  }

  download(){
    let downloadRiders;
    if(this.finisherView){
      downloadRiders = "entryId,memberId,name,status,hours,mins\n";
      for (let rider of this.riders){
        let downloadRider = [
          rider._id,
          rider.memberId,
          rider.name,
          '',
          0,
          0
        ];
        downloadRiders = downloadRiders + (downloadRider.join(",")) + "\n";
      }
    } 
    else {
      downloadRiders="eventId,memberId,name,email,phone,under18,address1,address2,addressTown,postcode,emergencyContact,emergencyPhone,status\n"
      for (let rider of this.riders){
        let downloadRider = [
          rider.eventId, 
          rider.memberId  < 0? "Not registered" : rider.memberId, 
          rider.name, 
          rider.email, 
          rider.phone,
          this.isJunior(rider) ? "Y" : "N", 
          rider.emergencyContact, 
          rider.emergencyPhone, 
          rider.addressLine1,
          rider.addressLine2,
          rider.addressTown,
          rider.postcode,
          rider.status
        ];
        downloadRiders = downloadRiders + (downloadRider.join(",")) + "\n";
      }
    }
    var blob = new Blob([downloadRiders], {type: "text/csv;charset=utf-8"});
    saveAs(blob, `${this.selectedEvent._id}_${this.finisherView ? 'finishers' : 'starters'}.csv`);
  }

  riderDetails(rider) {
    const modalRef = this.modalService.open(RiderDetailsModalComponent, { size: 'm' });
    modalRef.componentInstance.rider = rider;
  }

  addRider() {
    const modalRef = this.modalService.open(RiderAddModalComponent, { size: 'm' });
    modalRef.componentInstance.riders = this.riders;
    modalRef.componentInstance.eventId = this.selectedEvent._id;
    modalRef.dismissed.subscribe(() => { this.filterRiders(); this.allRidersUpdated = false});
  }

  toggleView() {
    this.finisherView = !this.finisherView;
  }

  enableRiderSave(rider){
    rider.changed = true;
    if(rider.status === "Entered") this.allRidersUpdated = false;
  }

  checkComplete(): boolean{
    return (!this.riders.find(x => x.status === "Entered") && !this.riders.find(x => x.changed === true));
  }

  timeToInt(rider) : number {
    return (rider.rideHours*60 + rider.rideMins);
  }

  setRideTime(rider, rideTime){
    rider.rideHours = Math.floor(rideTime/60);
    rider.rideMins = rideTime%60;
  }

  uploadScreen(){
    this.showUploadScreen = !this.showUploadScreen;
  }

  async uploadFinishers() {

    try {   
      let input = this.uploadFile['finishers'];
      let suffix = input.name.split("\.").pop().toLowerCase();
      if(!input) throw {error: {message: "Please select a file"}};
      if(permittedFileTypes['finishers'].indexOf(suffix) == -1) throw {error: {message: `Invalid file type - must be ${permittedFileTypes['finishers'].join(',')}`}};
      if(input.size > (maxFileSize * 1048576)) throw {error: {message: `File too large - must be less than ${maxFileSize} MB`}};

      
      this.uploadErrors = [];
      let results = [];
      let data = this.uploadBuffer['finishers']
      data = data.replace(/\r/g, '');
      let lines = data.split('\n');
      for (const [index, line] of lines.entries()){
        let record = line.split(',');
        // skip first line if headers
        if(record[0] === "entryId") continue;
        // ignore blank line at end of file if there is one
        if(record.length === 1 && index === lines.length - 1) continue;
        if(record.length !== 7) {
          this.uploadErrors.push(`Record ${index} does not have the correct number of fields`);
          continue;
        }
        if(!this.riders.find(x => x._id === parseInt(record[0]) && x.memberId === parseInt(record[1]))) {
          this.uploadErrors.push(`Record ${index} rider / ride entry not found`);
          continue;
        }
        let status = record[3].toLowerCase();
        if(!Object.keys(statusMap).find(x => x === status)){
          this.uploadErrors.push(`Record ${index} invalid status code`);
          continue;
        }
        if(isNaN(record[4]) || isNaN(record[5])){
          this.uploadErrors.push(`Record ${index} invalid time`);
          continue;
        }
        results.push({
          _id: parseInt(record[0]),
          eventId: this.selectedEvent._id,
          status: statusMap[record[3].toLowerCase()],
          rideDate: this.selectedEvent.eventDate,
          rideTime: parseInt(record[4])*60 + parseInt(record[5]),
          additionalAAAPoints: 0,

        });
      }
      
      // stop here if data invalid
      if(this.uploadErrors.length !== 0) return;
      
      let updatedRecords = 0;
      for(let result of results){
        try {
          await this.rest.post('/riderData', result, { 'Authorization': localStorage.getItem("token") });
          updatedRecords++;
        }
        catch(e){
          if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
          else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
        }
        
      }
      if(updatedRecords > 0) this.alertsService.show(`${updatedRecords} records updated`, { classname: 'bg-success text-light', delay: 3000 });
      await this.getRiders();      
    }
    catch (e) {
      console.log(e);
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
      console.log(e.error);
    }
  }

  readFile(files: File[], source): void {
  
    this.uploadFile[source] = files[files.length - 1];
    const reader = new FileReader();
    reader.onload = () => {
      this.uploadBuffer[source] = reader.result;
      console.log(reader.result);
      if(source === "finishers") this.uploadFinishers();
    }
    reader.readAsText(this.uploadFile[source]);
    
    
  }

  async saveRider(rider, finishNow) {

    if(finishNow){
      let rideTime = Math.floor((new Date().valueOf() - new Date(this.selectedEvent.eventDate).valueOf())/(1000*60));
      this.setRideTime(rider, rideTime);
      rider.status = "Finished";
    }
    
    rider.rideTime = this.timeToInt(rider); 
    try {
      await this.rest.post('/riderData', rider, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Rider record updated", { classname: 'bg-success text-light', delay: 3000 });
      rider.changed = false;
      this.allRidersUpdated = this.checkComplete();
    }
    catch(e){
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async completeEntries(){
    try {
      let params = {
        eventId: this.selectedEvent._id,
        status: 'Validation'
      };

      await this.rest.post('/eventData/status', params, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Event status updated", { classname: 'bg-success text-light', delay: 3000 });
      this.selectedEvent.eventStatus = 'Validation'
    }
    catch(e){
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async labels(){
    try {

      let data:any = await this.rest.post('/pdf/labels', this.riders, {accept:'application/pdf'});
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

}
