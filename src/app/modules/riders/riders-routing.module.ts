import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorGuard } from '../../auth/editor.guard';
import { FinisherGuard } from '../../auth/finisher.guard';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { PermanentsListComponent } from './permanents-list/permanents-list.component';
import { RidersAaaComponent } from '../riders/riders-aaa/riders-aaa.component';
import { RidersDiyComponent } from '../riders/riders-diy/riders-diy.component';
import { RidersEceComponent } from '../riders/riders-ece/riders-ece.component';
import { CalendarValidateComponent } from './calendar-validate/calendar-validate.component';
import { PermanentsValidateComponent } from './permanents-validate/permanents-validate.component';
import { IncidentListComponent } from './incident-list/incident-list.component';


const routes: Routes = [  
    { path: 'calendar-list', component: CalendarListComponent, canActivate: [FinisherGuard] },
    { path: 'permanents-list', component: PermanentsListComponent, canActivate: [FinisherGuard] },
    { path: 'riders-aaa', component: RidersAaaComponent, canActivate: [FinisherGuard] },
    { path: 'riders-diy', component: RidersDiyComponent, canActivate: [FinisherGuard] },
    { path: 'riders-ece', component: RidersEceComponent, canActivate: [FinisherGuard] },
    { path: 'calendar-validate', component: CalendarValidateComponent, canActivate: [FinisherGuard] },
    { path: 'permanents-validate', component: PermanentsValidateComponent, canActivate: [FinisherGuard] },
    { path: 'incident-list', component: IncidentListComponent, canActivate: [FinisherGuard] }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RidersRoutingModule { }