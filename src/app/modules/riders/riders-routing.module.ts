import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorGuard } from '../../auth/editor.guard';
import { FinisherGuard } from '../../auth/finisher.guard';
import { StartListComponent } from './start-list/start-list.component';
import { RidersAaaComponent } from '../riders/riders-aaa/riders-aaa.component';
import { RidersDiyComponent } from '../riders/riders-diy/riders-diy.component';
import { RidersEceComponent } from '../riders/riders-ece/riders-ece.component';
import { ValidateComponent } from './validate/validate.component';


const routes: Routes = [  
    { path: 'start-list', component: StartListComponent, canActivate: [FinisherGuard] },
    { path: 'riders-aaa', component: RidersAaaComponent, canActivate: [FinisherGuard] },
    { path: 'riders-diy', component: RidersDiyComponent, canActivate: [FinisherGuard] },
    { path: 'riders-ece', component: RidersEceComponent, canActivate: [FinisherGuard] },
    { path: 'validate', component: ValidateComponent, canActivate: [FinisherGuard] }
   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RidersRoutingModule { }