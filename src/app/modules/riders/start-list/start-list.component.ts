import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertsService } from '../../../services/alerts.service';
import { RestService } from '../../../services/rest.service';
import { Globals } from '../../../globals';
import { saveAs } from 'file-saver';
import { RiderStatusModalComponent } from '../rider-status-modal/rider-status-modal.component';
import { RiderAddModalComponent } from '../rider-add-modal/rider-add-modal.component';

@Component({
  selector: 'app-start-list',
  templateUrl: './start-list.component.html',
  styleUrls: ['./start-list.component.css']
})
export class StartListComponent implements OnInit {

  riders: any;
  selectedRider: any = null;
  filteredRiders: any;
  myEvents: any = [];
  selectedEventId: number = 0;
  riderFilter: string = "";

  constructor(public globals: Globals, public alertsService: AlertsService, private rest: RestService, private modalService: NgbModal) { 
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    try {
      this.myEvents = await this.rest.get('/eventData/eventList', { status: "open" }, { 'Authorization': localStorage.getItem("token") });
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async getRiders() {
    try {
      let params = {eventId: this.selectedEventId};
      this.riders = await this.rest.get('/riderData/list', params, { 'Authorization': localStorage.getItem("token") });
      this.filterRiders();
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
    this.filteredRiders = this.riders.filter(x => x.name.search(this.riderFilter) !== -1);
  }

  download(){
    let downloadRiders="eventId,memberId,name,email,under18,emergencyContact,emergencyPhone,status\n"
    for (let rider of this.riders){
      let downloadRider = [rider.eventId, rider.memberId, rider.name, rider.email, this.isJunior(rider) ? "Y" : "N", rider.emergenContact, rider.emergencyPhone, rider.status];
      downloadRiders = downloadRiders + (downloadRider.join(",")) + "\n";
    }
    var blob = new Blob([downloadRiders], {type: "text/csv;charset=utf-8"});
    saveAs(blob, "downloadRiders.csv");
  }

  riderStatus(rider) {
    if(rider.status === 'Validated') {
      this.alertsService.show("This ride has already been validated - you can't change it", { classname: 'bg-warning text-light', delay: 3000 });
      return;
    }
    const modalRef = this.modalService.open(RiderStatusModalComponent, { size: 'm' });
    modalRef.componentInstance.rider = rider;
  }

  addRider() {
    const modalRef = this.modalService.open(RiderAddModalComponent, { size: 'm' });
    modalRef.componentInstance.riders = this.riders;
    modalRef.componentInstance.eventId = this.selectedEventId;
    modalRef.dismissed.subscribe(() => { this.filterRiders(); });
  }

}
