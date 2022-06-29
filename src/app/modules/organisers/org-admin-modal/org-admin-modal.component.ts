import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from "../../../services/rest.service";
import { RefDataService } from "../../../services/refData.service";
import { Globals } from '../../../globals';
import { AlertsService } from '../../../services/alerts.service';
import { environment } from '../../../../environments/environment';

const permittedFileTypes =  [ 'jpg', 'jpeg', 'png', 'svg' ];
const maxFileSize = 0.25;

@Component({
    selector: 'app-org-admin-modal',
    templateUrl: './org-admin-modal.component.html'
})
export class OrgAdminModalComponent {
    @Input()

    public organiser: any = { };
    regions: any = [ "South-East", "South-West", "North-West", "North-East", "Scotland"];
    onlinePaymentTypes: any = [ "Disabled", "Paypal", "Stripe"];
    isNew = false;
    editDisabled = true; 
    isAdmin = false;
    uploadFile: File = null;
    uploadBuffer: any = null
    possibleGroups: string[];
    selectedGroups: string[];
    myGroups: string[];
    members: any[];
    mentorName: string = null;
    
    API_URL: string = environment.API_URL;
    STORAGE_URL = environment.STORAGE_URL;

    constructor(public activeModal: NgbActiveModal, public refData: RefDataService, private rest: RestService, public globals: Globals, private alertsService: AlertsService) { }

    async ngOnInit() {
        if(!this.organiser._id) this.isNew = true;
        if (this.globals.user.groups.some( x => ['cal-admin', 'perm-admin'].includes(x))) this.isAdmin = true;
        this.editDisabled = this.organiser._id === this.globals.user._id || this.isAdmin ? false : true;
        this.mentorName = `${this.organiser.mentorFirstname ? this.organiser.mentorFirstname : ""} ${this.organiser.mentorLastname ? this.organiser.mentorLastname : ""}`
        
    }
    
    async editOrg() {
        try {
            await this.rest.post('/orgData', this.organiser, { headers: { 'Authorization': localStorage.getItem("token") } });
            this.alertsService.show("Member record updated...", { classname: 'bg-success text-light', delay: 3000 });

        }
        catch (e) {
            if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
            else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
            console.log(e);
        }
    }

    readFile(files: File[]): void {
      this.uploadFile = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.uploadBuffer = reader.result;
      }
      reader.readAsArrayBuffer(this.uploadFile);
    }

    async getDetails() {
      try {
        let response = <any[]>(await this.rest.get('/orgData/memberDetails', {id:this.organiser._id}, { headers: { 'Authorization': localStorage.getItem("token") } }));
        if(response.length === 0) {
          this.organiser = {};
          throw({error:{message:"No member found"}})
        }
        else {
          let member = response[0];
          if(member.orgId) throw({error:{message:"This member is already an organiser!"}})
          this.organiser.email = member.email;
          this.organiser.firstname = member.firstname;
          this.organiser.lastname = member.lastname;
          this.organiser.onlinePaymentType = 'Paypal';
          this.organiser.postalPaymentAllowed = true;
          this.organiser.enabled = true;
          this.organiser.level = 1;
          this.organiser.provisional = true;
        }
          
        
    }
      catch (e) {
          if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
          else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
          console.log(e);
      }
    }

    async addMentor() {
      try {
        let response = <any[]>(await this.rest.get('/orgData/memberDetails', {id:this.organiser.mentor}, { headers: { 'Authorization': localStorage.getItem("token") } }));
      

        if(response.length === 0) {
          throw({error:{message:"No member found"}})
        }
        else {
          let mentor = response[0];
          this.mentorName = `${mentor.firstname ? mentor.firstname : ""} ${mentor.lastname ? mentor.lastname : ""}`
        }
      }
      catch (e) {
          if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
          else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
          console.log(e);
      }
      
    }

    async upload(event) {

      try {   
        event.preventDefault();
        if(!this.uploadFile) throw {error: {message: "Please select a file"}};
        if(permittedFileTypes.indexOf(this.uploadFile.name.split("\.").pop().toLowerCase()) == -1) throw {error: {message: "Invalid file type - must be .fit, .gpx, .tcx or .zip"}};
        if(this.uploadFile.size > (maxFileSize * 1048576)) throw {error: {message: `File too large - must be less than ${maxFileSize} MB`}};
        
        let params = {
          _id: this.organiser._id,
          fileName: `logos/${this.uploadFile.name}`
        };
        
        let response = <any>(await this.rest.post('/orgData/uploadURL', params, { 'Authorization': localStorage.getItem("token") }));
        console.log(response);
        console.log(this.uploadFile.type);
        await fetch(response.url, { method: 'PUT', body: this.uploadBuffer, headers: {'content-type': this.uploadFile.type}})
        this.alertsService.show("File uploaded.", { classname: 'bg-success text-light', delay: 3000 });
        this.organiser.logoFileURL = `logos/${this.organiser._id}.${this.uploadFile.type}`;
        // https://www.geeksforgeeks.org/how-to-reset-selected-file-with-input-tag-file-type-in-angular-9/
        // https://blog.angular-university.io/angular-file-upload/
        
      }
      catch (e) {
        if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
        else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
        console.log(e.error);
      }
    }

}