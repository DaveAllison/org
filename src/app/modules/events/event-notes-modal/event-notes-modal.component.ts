import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from "../../../services/rest.service";
import { RefDataService } from "../../../services/refData.service";
import { Globals } from '../../../globals';
import { AlertsService } from '../../../services/alerts.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-event-notes-modal',
  templateUrl: './event-notes-modal.component.html',
  styleUrls: ['./event-notes-modal.component.css']
})
export class EventNotesModalComponent {

    @Input()

    public eventId: number;
    public adminGroup: string;
    public notes: any = [];
    note: string="";

    constructor(public activeModal: NgbActiveModal, public refData: RefDataService, private rest: RestService, public globals: Globals, private alertsService: AlertsService) { }

    async ngOnInit() {
      //this.notes = await this.rest.get('/eventData/notes', { _id: this.modalEvent._id }, { 'Authorization': localStorage.getItem("token") });
    }

    async addNote(){
      let newNote = {
        eventId: this.eventId,
        adminGroup: this.adminGroup,
        note: this.note,
        createdBy: this.globals.user._id,
        createdDate: new Date().toISOString()
      }

      try {
        await this.rest.post('/eventData/note', newNote, { headers: { 'Authorization': localStorage.getItem("token") } });
        this.alertsService.show("Note added...", { classname: 'bg-success text-light', delay: 3000 });
        this.notes.push(newNote);
        this.note = "";
        

      }
      catch (e) {
          if (e.error && e.error.message) this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
          else this.alertsService.show("An error occurred", { classname: 'bg-danger text-light', delay: 3000 });
          console.log(e);
      }
    }

    formatDate(d){
      let dateTimeString = new Date(d).toLocaleString("en-GB", { timeZone: 'Europe/London' });
      return `${dateTimeString.substring(6,10)}-${dateTimeString.substring(3,5)}-${dateTimeString.substring(0,2)} ${dateTimeString.substring(12,17)}`;
    }
    
    

}
