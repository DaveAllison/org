import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { AlertsService } from '../../../services/alerts.service';
import { RestService } from '../../../services/rest.service';

@Component({
  selector: 'app-completion',
  templateUrl: './completion.component.html',
  styleUrls: ['./completion.component.css']
})
export class CompletionComponent implements OnInit {

  confirmed: boolean = false;
  clientSecret: string;
  paymentIntent: string;

  constructor(private activatedRoute: ActivatedRoute, public alertsService: AlertsService, private rest: RestService) { }

  async ngOnInit() {

    this.activatedRoute.queryParams.subscribe(params => { this.paymentIntent = params['payment_intent']; });
    try {
      await this.rest.post('/payment/complete', {paymentIntent:this.paymentIntent}, {});
      this.confirmed = true;
    }
    catch(e){
      console.log(e);
      this.alertsService.show(e.error.message, { classname: 'bg-danger text-light', delay: 3000 });
    }

  }

}
