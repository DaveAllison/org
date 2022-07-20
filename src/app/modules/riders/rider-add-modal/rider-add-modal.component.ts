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
  email: string;
  postcode: string;
  eventId: number;
  members: any;
  rider:any;
  unregisteredRider:any = {}
  public riders: any;
  entryType: string = "registered";

  constructor(public globals: Globals, public activeModal: NgbActiveModal, public alertsService: AlertsService, private rest: RestService) { 
    this.globals['bgImage'] = "none";
  }

  ngOnInit(): void {
  }

  async getMember(){
    try {
      this.rider = null;
      let params = {
        email: this.email = this.email ? this.email : null,
        postcode: this.postcode = this.postcode ? this.postcode : null,
        memberId: this.memberId = this.memberId ? this.memberId : 0
      }
      
      this.members = await this.rest.get('/riderData/entrant', params, { 'Authorization': localStorage.getItem("token") });

      for (let member of this.members){
        member.name = `${member.firstname} ${member.surname}`
      }

      if(this.members.length === 0) this.alertsService.show("No rider found with these details", { classname: 'bg-warning text-light', delay: 3000 });
      else if(this.members.length === 1){
        if(this.riders.some(x => x.memberId === this.members[0].memberId)) this.alertsService.show("This member is already on the rider list", { classname: 'bg-warning text-light', delay: 3000 });
        else {
          this.rider = this.members[0];
          this.rider.status = "Entered";
        }
      }
      else {
        if(this.members.length >= 10) this.alertsService.show("Too many riders with these details. Please refine your search", { classname: 'bg-warning text-light', delay: 3000 });
      }
      
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  setRider(rider){
    this.rider = rider;
    this.rider.status = "Entered";
  }

  async save(){

    try {

      if(this.entryType === "registered"){
        let params = {
          memberId: this.rider.memberId, 
          eventId: this.eventId,
          status: this.rider.status,
        };
  
        await this.rest.post('/riderData/online', params, { 'Authorization': localStorage.getItem("token") });
        this.riders.push(this.rider);
      }
      else {
        this.unregisteredRider.status = 'Entered';
        this.unregisteredRider.eventId = this.eventId;
        let result = await this.rest.post('/riderData/onlinenr', this.unregisteredRider, { 'Authorization': localStorage.getItem("token") });
        this.unregisteredRider.memberId = result['memberId'];
        this.unregisteredRider.name = `${this.unregisteredRider.firstname} ${this.unregisteredRider.surname}`;
        this.riders.push(this.unregisteredRider);
      }
      
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }

    this.activeModal.dismiss();
  }

}
