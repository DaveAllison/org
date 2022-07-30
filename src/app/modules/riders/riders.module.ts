import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { RidersAaaComponent } from '../riders/riders-aaa/riders-aaa.component';
import { RidersDiyComponent } from '../riders/riders-diy/riders-diy.component';
import { RidersEceComponent } from '../riders/riders-ece/riders-ece.component';
import { RidersRoutingModule } from './riders-routing.module';
import { RiderAddModalComponent } from './rider-add-modal/rider-add-modal.component';
import { CalendarValidateComponent } from './calendar-validate/calendar-validate.component';
import { IncidentListComponent } from './incident-list/incident-list.component';
import { IncidentModalComponent } from './incident-modal/incident-modal.component';
import { RiderDetailsModalComponent } from './rider-details-modal/rider-details-modal.component';
import { PermanentsListComponent } from './permanents-list/permanents-list.component';
import { PermanentsValidateComponent } from './permanents-validate/permanents-validate.component';



@NgModule({
  declarations: [
    CalendarListComponent,
    RiderAddModalComponent,
    RidersAaaComponent,
    RidersDiyComponent,
    RidersEceComponent,
    CalendarValidateComponent,
    IncidentListComponent,
    IncidentModalComponent,
    RiderDetailsModalComponent,
    PermanentsListComponent,
    PermanentsValidateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RidersRoutingModule,
    IMaskModule
  ]
})
export class RidersModule { }
