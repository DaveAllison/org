import { Injectable, TemplateRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {

  toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    let toast = { textOrTpl, ...options };
    let delay = options.delay || 3000;
    this.toasts.push(toast);
    setTimeout(() => { this.toasts = this.toasts.filter(t => t !== toast)}, delay);
    console.log(this.toasts);
  }

  remove() {
    this.toasts = this.toasts.filter(t => t !== alert);
  }
}
