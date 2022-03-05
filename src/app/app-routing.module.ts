import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AukloginComponent } from './members/auklogin';
import { HomeComponent } from './base-components/home';
import { ErrorComponent } from './base-components/error';

const routes: Routes = [
  { path: 'auklogin', component: AukloginComponent },
  //{ path: 'events/:type', component: EventsComponent },
  { path: 'home', component: HomeComponent },
  //{ path: 'login', component: LoginComponent },
  { path: 'error/:errorCode', component: ErrorComponent },
  { path: 'events', loadChildren: () => import('./modules/events/events.module').then(m => m.EventsModule)},
  { path: 'organisers', loadChildren: () => import('./modules/organisers/organisers.module').then(m => m.OrganisersModule)},
  { path: 'payments', loadChildren: () => import('./modules/payments/payments.module').then(m => m.PaymentsModule)},
  { path: 'riders', loadChildren: () => import('./modules/riders/riders.module').then(m => m.RidersModule)},

  // otherwise redirect to login page
  { path: '**', redirectTo: 'home' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
