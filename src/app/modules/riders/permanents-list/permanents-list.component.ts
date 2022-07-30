import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../services/alerts.service';
import { RestService } from '../../../services/rest.service';
import { RefDataService } from '../../../services/refData.service';
import { Globals } from '../../../globals';
import { saveAs } from 'file-saver';
import { RiderDetailsModalComponent } from '../rider-details-modal/rider-details-modal.component';
import { RiderAddModalComponent } from '../rider-add-modal/rider-add-modal.component';

@Component({
  selector: 'app-permanents-list',
  templateUrl: './permanents-list.component.html',
  styleUrls: ['./permanents-list.component.css']
})
export class PermanentsListComponent implements OnInit {

  riders: any;
  selectedEvent: any = null;
  selectedRider: any = null;
  eventInFuture: boolean = false;
  filteredRiders: any;
  myEvents: any = [];
  riderFilter: string = "";
  statusFilter: string = 'Any Status'
  statusFilterList: string[] = [ 'Any Status']

  constructor(public globals: Globals, public alertsService: AlertsService, private rest: RestService, public refDataService: RefDataService, private modalService: NgbModal) { 
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    this.statusFilterList = this.statusFilterList.concat(this.refDataService.entryStatuses())
    try {
      this.myEvents = await this.rest.get('/eventData/eventList', { target: "riderList", eventType: "P" }, { 'Authorization': localStorage.getItem("token") });
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
        if(new Date(this.selectedEvent.eventDate) > new Date()) this.eventInFuture = true;
        let params = {eventId: this.selectedEvent._id};
        this.riders = await this.rest.get('/riderData/list', params, { 'Authorization': localStorage.getItem("token") });
        for (let rider of this.riders){
          rider.name = `${rider.firstname} ${rider.surname}`
          this.setRideTime(rider, rider.rideTime);
          rider.changed = false;
        }
        this.filterRiders();
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
    this.filteredRiders = this.riders.filter(x => x.name.toLowerCase().search(this.riderFilter.toLowerCase()) !== -1 && (this.statusFilter === 'Any Status' || x.status === this.statusFilter));
  }

  download(){
    let downloadRiders="eventId,memberId,name,email,phone,under18,address1,address2,addressTown,postcode,emergencyContact,emergencyPhone,status\n"
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
    var blob = new Blob([downloadRiders], {type: "text/csv;charset=utf-8"});
    saveAs(blob, `${this.selectedEvent._id}_riders.csv`);
  }

  riderDetails(rider) {
    const modalRef = this.modalService.open(RiderDetailsModalComponent, { size: 'm' });
    modalRef.componentInstance.rider = rider;
  }

  addRider() {
    const modalRef = this.modalService.open(RiderAddModalComponent, { size: 'm' });
    modalRef.componentInstance.riders = this.riders;
    modalRef.componentInstance.eventId = this.selectedEvent._id;
    modalRef.dismissed.subscribe(() => { this.filterRiders() });
  }

  enableRiderSave(rider){
    if(rider.status !== 'Validated') rider.changed = true;
  }

  timeToInt(rider) : number {
    return (rider.rideHours*60 + rider.rideMins);
  }

  setRideTime(rider, rideTime){
    rider.rideHours = Math.floor(rideTime/60);
    rider.rideMins = rideTime%60;
  }

  async saveRider(rider) {
    
    try {
      rider.rideTime = this.timeToInt(rider); 
      if(rider.status === 'Finished' && (!rider.rideDate || !rider.rideTime)) throw("Ride Date and Time are required");
      await this.rest.post('/riderData', rider, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Rider record updated", { classname: 'bg-success text-light', delay: 3000 });
      rider.changed = false;
    }
    catch(e){
      this.alertsService.show(e.error && e.error.message ? e.error.message : e, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }


}
