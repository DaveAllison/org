import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EditorGuard } from '../../auth/editor.guard';
import { FinisherGuard } from '../../auth/finisher.guard';

import { PaymentComponent } from './payment/payment.component';
import { CompletionComponent } from './completion/completion.component';


const routes: Routes = [  
    { path: 'payment/:clientSecret', component: PaymentComponent, canActivate: [EditorGuard] },   
    { path: 'completion', component: CompletionComponent, canActivate: [EditorGuard] },   
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentsRoutingModule { }