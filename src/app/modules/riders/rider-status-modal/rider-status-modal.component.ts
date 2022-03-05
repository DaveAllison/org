import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RefDataService } from '../../../services/refData.service';
import { RestService } from '../../../services/rest.service';
import { AlertsService } from '../../../services/alerts.service';
import { environment } from '../../../../environments/environment';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-rider-status-modal',
  templateUrl: './rider-status-modal.component.html',
  styleUrls: ['./rider-status-modal.component.css']
})
export class RiderStatusModalComponent implements OnInit {

  @Input()
  public rider: any;
  public rideTime: number[] = [0, 0, 0];
  
  constructor(public globals: Globals, public activeModal: NgbActiveModal, public alertsService: AlertsService, public refDataService: RefDataService, private rest: RestService) { 
    this.globals['bgImage'] = "none";
  }

  ngOnInit(): void {
    //this.entryStatuses = this.refDataService.entryStatuses();
    this.rideTime = [ Math.floor(this.rider.rideTime/(24*60)), Math.floor((this.rider.rideTime%(24*60))/60), this.rider.rideTime%60 ];
    this.rider.cycleType = this.rider.cycleType ? this.rider.cycleType : this.refDataService.cycleTypes()[0];
  }

  timeToInt() : number {
    
      return (this.rideTime[0]*24*60 + this.rideTime[1]*60 + this.rideTime[2]);
  }

  async save() {
    this.rider.rideTime = this.timeToInt(); 
    try {
      await this.rest.post('/riderData', this.rider, { 'Authorization': localStorage.getItem("token") });
      this.alertsService.show("Rider record updated", { classname: 'bg-success text-light', delay: 3000 });
      this.rider.changed = false;
    }
    catch(e){
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
    }
    
  }

}
