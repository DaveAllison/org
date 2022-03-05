import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Globals } from '../../../globals';
import { RestService } from '../../../services/rest.service';
import { environment } from '../../../../environments/environment';
import {loadStripe} from '@stripe/stripe-js';



//https://medium.com/bitontree/integrate-stripe-with-angular-10-e9e86874d889

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  stripeKey: string = environment.STRIPE_KEY;
  stripeReturnURL: string = environment.STRIPE_RETURN_URL;
  clientSecret: string;

  constructor(private activatedRoute: ActivatedRoute, private rest: RestService, public globals: Globals) { }

  async ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
        this.clientSecret = params['clientSecret'];
    });
    this.globals.spinner = true;
   
    const stripe = await loadStripe(this.stripeKey);
    const options = {
      clientSecret: this.clientSecret,
      theme: 'stripe'
    };

    
    const elements = stripe.elements(options);
    const paymentElement = elements.create('payment');
    paymentElement.mount('#payment-element');
    
    this.globals.spinner = false;
    
    const form = document.getElementById('payment-form');

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      this.globals.spinner = true;

      const {error} = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: this.stripeReturnURL,
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        const messageContainer = document.querySelector('#error-message');
        messageContainer.textContent = error.message;
      } 
      else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
      this.globals.spinner = false;
    });

  }
}
