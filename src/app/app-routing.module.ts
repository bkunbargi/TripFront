import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TripPageComponent } from './trip-page/trip-page.component';
import { OneTripComponent } from './one-trip/one-trip.component';
import { SingletripComponent } from './singletrip/singletrip.component';


const routes: Routes = [
  {
    path:'',
    redirectTo: '/Home',
    pathMatch: 'full' 
  },
  {
    path: 'Home', 
    component: TripPageComponent
  },
  {
    path: 'trippage',
    component: OneTripComponent
    // data :{data : OneTripComponent}
  },
  {
    path: 'singletrip',
    component:SingletripComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
