import { Component, OnInit } from '@angular/core';
import { RestService } from "../../../services/rest.service";
import { TokenService } from '../../../services/token.service';
import { AlertsService } from '../../../services/alerts.service';
import { Globals } from '../../../globals';

const permittedFileTypes = [ 'fit', 'gpx', 'tcx', 'zip' ];
const maxFileSize = 2;

@Component({
  selector: 'app-track-upload',
  templateUrl: './track-upload.component.html'
})
export class TrackUploadComponent implements OnInit {

  user: any;
  uploadFile: File = null;
  uploadBuffer: any = null;
  events: any=[];
  eventId: string;
  eventDate: string;
  memNum: number;
  memName: string;
  rating: number = 0;
  comment: string;
  cycleType: string = 'solo';
  cycleTypes: string[] = ['fixed', 'solo', 'tandem', 'tricycle', 'recumbent'];
  


  constructor(private rest: RestService, public globals: Globals, private alertsService: AlertsService, private token: TokenService) { }

  async ngOnInit() {
    this.globals.bgImage = "none";
    this.globals['bgText'] = null;

    try {
      this.user = this.token.getUser();
      //this.events = await this.rest.get('/eventData/orgsList', {listAll:"Y", ebApproved:"true"}, { 'Authorization': localStorage.getItem("token") });
      this.events = [{_id:1, eventDate:'2021-10-01', name:'test'}];
      console.log(this.user);
    }
    catch (e) {
      console.log(e);
      this.alertsService.show(e.message, { classname: 'bg-danger text-light', delay: 3000 });
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

  async upload() {

    try {   

      if(!this.uploadFile) throw {error: {message: "Please select a file"}};
      if(permittedFileTypes.indexOf(this.uploadFile.name.split("\.").pop().toLowerCase()) == -1) throw {error: {message: "Invalid file type - must be .fit, .gpx, .tcx or .zip"}};
      if(this.uploadFile.size > (maxFileSize * 1048576)) throw {error: {message: `File too large - must be less than ${maxFileSize} MB`}};
      
      let params = {
        fileName: `tracks/${this.uploadFile.name}`,
        eventDate: this.eventDate,
        eventId: this.eventId,
        rating: this.rating,
        cycleType: this.cycleType,
        comment: this.comment,
        memNum: this.memNum,
        memName: this.memName
      };
      
      let response = <any>(await this.rest.post('/eventData/xuploadURL', params, { 'Authorization': localStorage.getItem("token") }));
      console.log(response);
      await fetch(response.url, { method: 'PUT', body: this.uploadBuffer, headers: {'content-type': this.uploadFile.type}})
      this.alertsService.show("Your track has been uploaded. The results will be e-mailed to you, and you can check your completed rides record for a brevet record shortly", { classname: 'bg-success text-light', delay: 3000 });
    }
    catch (e) {
      if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
      else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
      console.log(e.error);
    }
  }

  isOrg(): boolean{
    if(this.user.eventGroup) return true;
    else return false;
  }

}
