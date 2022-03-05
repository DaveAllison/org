import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from "../../../services/rest.service";
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
    
    API_URL: string = environment.API_URL;
    STORAGE_URL = environment.STORAGE_URL;

    constructor(public activeModal: NgbActiveModal, private rest: RestService, public globals: Globals, private alertsService: AlertsService) { }

    async ngOnInit() {
        if(!this.organiser._id) this.isNew = true;
        this.editDisabled = this.organiser._id === this.globals.user._id || this.globals.user.groups.includes("event-admin") ? false : true;
        if(this.globals.user.groups.includes("event-admin")) this.isAdmin = true;
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