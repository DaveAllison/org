import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';

import { OrgAdminComponent } from './org-admin/org-admin.component';
import { OrgProfileComponent } from './org-profile/org-profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { DownloadComponent } from './download/download.component';
import { TrackUploadComponent } from './track-upload/track-upload.component';

const routes: Routes = [  
    { path: 'org-admin', component: OrgAdminComponent, canActivate: [AuthGuard] },
    { path: 'org-profile', component: OrgProfileComponent, canActivate: [AuthGuard] },
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'download', component: DownloadComponent, canActivate: [AuthGuard] },
    { path: 'track-upload', component: TrackUploadComponent, canActivate: [AuthGuard] },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrganisersRoutingModule { }