import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IMaskModule } from 'angular-imask';
import { StartListComponent } from './start-list/start-list.component';
import { RidersAaaComponent } from '../riders/riders-aaa/riders-aaa.component';
import { RidersDiyComponent } from '../riders/riders-diy/riders-diy.component';
import { RidersEceComponent } from '../riders/riders-ece/riders-ece.component';
import { RidersRoutingModule } from './riders-routing.module';
import { RiderStatusModalComponent } from './rider-status-modal/rider-status-modal.component';
import { RiderAddModalComponent } from './rider-add-modal/rider-add-modal.component';
import { ValidateComponent } from './validate/validate.component';
import { IncidentListComponent } from './incident-list/incident-list.component';
import { IncidentModalComponent } from './incident-modal/incident-modal.component';



@NgModule({
  declarations: [
    StartListComponent,
    RiderStatusModalComponent,
    RiderAddModalComponent,
    RidersAaaComponent,
    RidersDiyComponent,
    RidersEceComponent,
    ValidateComponent,
    IncidentListComponent,
    IncidentModalComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RidersRoutingModule,
    IMaskModule
  ]
})
export class RidersModule { }
