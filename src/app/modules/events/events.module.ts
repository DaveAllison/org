import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QRCodeModule } from 'angularx-qrcode';
import { IMaskModule } from 'angular-imask';
import { EventsRoutingModule } from './events-routing.module';
import { EventAdminComponent } from './event-admin/event-admin.component';
import { QrPipe } from './event-admin/qr.pipe';
import { QrModalComponent } from './qr-modal/qr-modal.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventViewModalComponent } from './event-view-modal/event-view-modal.component';



@NgModule({
  declarations: [EventAdminComponent, QrPipe, QrModalComponent, EventListComponent, EventViewModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    EventsRoutingModule,
    QRCodeModule,
    IMaskModule
  ]
})
export class EventsModule { }
