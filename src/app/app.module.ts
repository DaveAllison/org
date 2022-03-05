import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { Globals } from './globals';
import { AppComponent } from './app.component';
import { MenuComponent } from './base-components/menu/menu.component';
import { EventViewComponent } from './base-components/event-view-modal/event-view-modal.component';
import { LoginComponent } from './members/login/login.component';
import { FooterComponent } from './base-components/footer/footer.component';
import { ErrorComponent } from './base-components/error/error.component';
import { AukloginComponent } from './members/auklogin/auklogin.component';
import { AlertsComponent } from './base-components/alerts/alerts.component';
import { SpinnerComponent } from './base-components/spinner/spinner.component';
import { HomeComponent } from './base-components/home/home.component';
import { EventsComponent } from './base-components/events/events.component';


@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    EventViewComponent,
    LoginComponent,
    FooterComponent,
    ErrorComponent,
    AukloginComponent,
    AlertsComponent,
    SpinnerComponent,
    HomeComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [Globals],
  bootstrap: [AppComponent]
})
export class AppModule { }
