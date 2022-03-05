import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorGuard } from '../../auth/editor.guard';
import { FinisherGuard } from '../../auth/finisher.guard';
import { EventAdminComponent } from './event-admin/event-admin.component';
import { EventListComponent } from './event-list/event-list.component';




const routes: Routes = [  
    { path: 'event-list/:type', component: EventListComponent, canActivate: [EditorGuard] },
    { path: 'event-admin', component: EventAdminComponent, canActivate: [EditorGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventsRoutingModule { }