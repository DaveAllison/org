import { Component, OnInit } from '@angular/core';
import { RestService } from "../../../services/rest.service";
import { Title } from '@angular/platform-browser';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from "@angular/router";
import { Globals } from '../../../globals';
import { environment } from '../../../../environments/environment';
import { AlertsService } from '../../../services/alerts.service';
import { OrgAdminModalComponent } from '../org-admin-modal/org-admin-modal.component';

@Component({
  selector: 'app-org-admin',
  templateUrl: './org-admin.component.html'
})
export class OrgAdminComponent implements OnInit {

  organisers: any = [];
  regions: any = [ "South-East", "South-West", "North-West", "North-East", "Scotland"];
  params = {
    region: "South-East",
    restartId: "0"
  };


  constructor(private router: Router, private rest: RestService, private modalService: NgbModal, private titleService: Title, private globals: Globals, private alertsService: AlertsService) { }

  ngOnInit(): void {
    this.titleService.setTitle('Organisers - Organiser Admin');
    this.globals['bgImage'] = "none";
    this.globals['bgText'] = null;
    this.getOrgs(false);
  }

  async getOrgs(more) {
    try {
      if(!more) this.params.restartId = "0"
      let response = <any[]>(await this.rest.get('/orgData/list', this.params, {'Authorization': localStorage.getItem("token")}));
      if(more && Object.keys(response).length === 0) throw ({error:{message : "No more organisers found"}}); // NB don't know that we have returned an array so can't test length
      this.organisers = more ? this.organisers.concat(response) : response;
      if(this.organisers.length === 0) throw ({error:{message : "No organisers found"}});
      this.params.restartId = this.organisers[this.organisers.length - 1]._id.toString();
      console.log(this.organisers[0])
    }
    catch(e){
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
      console.log(e);
    }
  }

  showOrg(organiser): void {
    const modalRef = this.modalService.open(OrgAdminModalComponent, { size: 'xl' });
    modalRef.componentInstance.organiser = organiser;
  }

  addNew(): void{
    let organiser = {};
    const modalRef = this.modalService.open(OrgAdminModalComponent, { size: 'xl' });
    modalRef.componentInstance.organiser = organiser;
  }

}
