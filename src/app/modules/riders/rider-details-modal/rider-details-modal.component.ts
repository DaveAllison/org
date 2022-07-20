import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RestService } from '../../../services/rest.service';
import { AlertsService } from '../../../services/alerts.service';
import { environment } from '../../../../environments/environment';
import { Globals } from '../../../globals';

@Component({
  selector: 'app-rider-details-modal',
  templateUrl: './rider-details-modal.component.html',
  styleUrls: ['./rider-details-modal.component.css']
})

export class RiderDetailsModalComponent implements OnInit {

  @Input()
  rider:any;

  constructor(public globals: Globals, public activeModal: NgbActiveModal, public alertsService: AlertsService, private rest: RestService) { 
    this.globals['bgImage'] = "none";
  }

  ngOnInit(): void {
  }

}
