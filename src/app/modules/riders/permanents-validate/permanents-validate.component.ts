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
  selector: 'app-permanents-validate',
  templateUrl: './permanents-validate.component.html',
  styleUrls: ['./permanents-validate.component.css']
})

export class PermanentsValidateComponent implements OnInit {

  riders: any;
  filteredRiders: any;
  riderFilter: string = "";
  myEvents: any = [];
  selectedEvent: any = null;
  selectedEventId: number = 0;;
  selectedMemberId: number = null;
  selectedStatus: string = 'Select Status';
  selectedDistance: number = 0;
  allRidersUpdated: boolean = true;
  selectableStatuses: string[] = [ 'Select Status', 'Finished', 'Validated'];

  constructor(private modalService: NgbModal, public globals: Globals, private titleService: Title, public alertsService: AlertsService, public refData: RefDataService, private rest: RestService ) {
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    this.titleService.setTitle('Organisers - Validation');
  }

  async getRiders() {
    try{
      if(this.selectedStatus === 'Select Status') this.riders = [];
      else {

        this.allRidersUpdated = false;
        let params = {status: this.selectedStatus, eventType: 'P'};  
        
        this.riders = await this.rest.get('/riderData/list', params, { 'Authorization': localStorage.getItem("token") });
        for (let rider of this.riders){
          rider.name = `${rider.firstname} ${rider.surname}`
          this.setRideTime(rider);
        }
      }
      this.filterRiders();
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  setRideTime(rider){
    rider.formattedRideTime = `${Math.floor(rider.rideTime/60).toFixed(0)}:${(rider.rideTime%60).toFixed(0).padStart(2,'0')}`;
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

  

  

 

}



