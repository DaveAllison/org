import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../../services/rest.service';
import { AlertsService } from '../../../services/alerts.service';
import { environment } from '../../../../environments/environment';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-rider-add-modal',
  templateUrl: './rider-add-modal.component.html',
  styleUrls: ['./rider-add-modal.component.css']
})
export class RiderAddModalComponent implements OnInit {

  @Input()
  memberId: number;
  eventId: number;
  members: any;
  rider:any;
  public riders: any;

  constructor(public globals: Globals, public activeModal: NgbActiveModal, public alertsService: AlertsService, private rest: RestService) { 
    this.globals['bgImage'] = "none";
  }

  ngOnInit(): void {
  }

  async getMember(){
    try {
      this.members = await this.rest.get('/riderData/entrant', { memberId: this.memberId }, { 'Authorization': localStorage.getItem("token") });
      if(this.members.length === 0) this.alertsService.show("No rider found with this membership number", { classname: 'bg-warning text-light', delay: 3000 });
      else if(this.riders.some(x => x.memberId === this.members[0].memberId)) this.alertsService.show("This member is already on the rider list", { classname: 'bg-warning text-light', delay: 3000 });
      else {
        this.rider = this.members[0];
        this.rider.status = "Entered";
      }
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async save(){

    try {

      let params = {
        memberId: this.rider.memberId, 
        eventId: this.eventId,
        status: this.rider.status,
      };

      await this.rest.post('/riderData/online', params, { 'Authorization': localStorage.getItem("token") });
      this.riders.push(this.rider);
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }

    this.activeModal.dismiss();
  }

}
