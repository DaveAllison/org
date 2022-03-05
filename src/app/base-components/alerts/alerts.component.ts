import { Component, TemplateRef } from '@angular/core';

import {AlertsService} from '../../services/alerts.service';

@Component({
  selector: 'app-alerts',
  template: `
    <ngb-toast
      *ngFor="let toast of alertsService.toasts"
      [class]="toast.classname"
      [autohide]="true"
      [delay]="5000"
      (hidden)="alertsService.remove()"
    >
      <ng-template [ngIf]="isTemplate(toast)" [ngIfElse]="text">
        <ng-template [ngTemplateOutlet]="toast.textOrTpl"></ng-template>
      </ng-template>

      <ng-template #text>{{ toast.textOrTpl }}</ng-template>
    </ngb-toast>
  `,
  host: {'[class.ngb-toasts]': 'true'}
})
export class AlertsComponent  {

  constructor(public alertsService: AlertsService) { }

  isTemplate(toast) { return toast.textOrTpl instanceof TemplateRef; }

}
