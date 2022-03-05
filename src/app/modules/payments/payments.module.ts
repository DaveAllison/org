import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentsRoutingModule } from './payments-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { CompletionComponent } from './completion/completion.component';



@NgModule({
  declarations: [
    PaymentComponent,
    CompletionComponent
  ],
  imports: [
    CommonModule,
    PaymentsRoutingModule
  ]
})
export class PaymentsModule { }
