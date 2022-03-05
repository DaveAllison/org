import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrganisersRoutingModule } from './organisers-routing.module';
import { DownloadComponent } from './download/download.component';
import { TrackUploadComponent } from './track-upload/track-upload.component';
import { OrgAdminComponent } from './org-admin/org-admin.component';
import { OrgAdminModalComponent } from './org-admin-modal/org-admin-modal.component';
import { OrgProfileComponent } from './org-profile/org-profile.component';



@NgModule({
  declarations: [ DownloadComponent, TrackUploadComponent, OrgAdminComponent, OrgAdminModalComponent, OrgProfileComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    OrganisersRoutingModule
  ]
})
export class OrganisersModule { }
