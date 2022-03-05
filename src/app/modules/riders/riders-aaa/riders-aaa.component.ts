import { Component, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { saveAs } from 'file-saver';
import { RestService } from '../../../services/rest.service';
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { AlertsService } from '../../../services/alerts.service';
import { NgControlStatus } from '@angular/forms';

@Component({
  selector: 'app-riders-aaa',
  templateUrl: './riders-aaa.component.html',
})
export class RidersAaaComponent implements OnInit {

  riders: any;
  myEvents: any = [];
  selectedEventId: string = 'all';
  selectedStatus: string = 'all';
  selectedDistance: number = 0;
  filteredRiders: any;
  riderFilter: string = "";
  

  API_URL: string = environment.API_URL;

  constructor(private modalService: NgbModal, public globals: Globals, public alertsService: AlertsService, private rest: RestService ) {
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
  }

  async ngOnInit() {
    try {
      this.myEvents = await this.rest.get('/eventData/eventList', { eventType: 'D'}, { 'Authorization': localStorage.getItem("token") });
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async getRiders() {
    try {
      let params = {
        eventId:this.selectedEventId
      };
     
      //if (this.selectedStatus && this.selectedStatus !== 'all') params['status'] = this.selectedStatus;
      this.riders = await this.rest.get('/riderData/list', params, { 'Authorization': localStorage.getItem("token") });
      this.filterRiders();
      
    }
    catch (error) {
      console.log(error);
      this.alertsService.show(error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }
  }

  async save(index) {
    
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


  changed(index){
    this.filteredRiders[index].changed = true;
  }


  filterRiders(){
    this.filteredRiders = this.riders.filter(x => x.name.search(this.riderFilter) !== -1);
  }


}


