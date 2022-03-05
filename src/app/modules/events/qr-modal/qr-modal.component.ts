import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-qr-modal',
  templateUrl: './qr-modal.component.html'
})
export class QrModalComponent {

  @Input() 
  public control: any;
  public eventId: string;

  constructor() { }

  

  getQrString(): string{
    return `AUK-${this.eventId}-${this.control.qrString}`;
  }

}
