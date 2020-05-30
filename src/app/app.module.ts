import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AgmCoreModule } from '@agm/core';

import { AppComponent } from './app.component';
import { OneTripComponent } from './one-trip/one-trip.component';
import { TripPageComponent } from './trip-page/trip-page.component';
import { UserLoginComponent } from './user-login/user-login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationModalComponent } from './location-modal/location-modal.component';
import { SingletripComponent } from './singletrip/singletrip.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { TripmapComponent } from './tripmap/tripmap.component';
import { environment } from 'src/environments/environment';
import { CostmodalComponent } from './costmodal/costmodal.component';


@NgModule({
  declarations: [
    AppComponent,
    OneTripComponent,
    TripPageComponent,
    UserLoginComponent,
    LocationModalComponent,
    SingletripComponent,
    DatepickerComponent,
    TripmapComponent,
    CostmodalComponent
  ],
  imports: [
    NgbModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: "AIzaSyASRkQJYBjX4TyrG3zijYbn9wnqoinTTYE",
      libraries: ["places","geometry"]
    })    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
