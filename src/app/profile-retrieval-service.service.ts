import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Observable, from } from 'rxjs';
import { NgbDate, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class ProfileRetrievalServiceService {

  private api_url:string;
  private trip_url:string;
  private delete_url:string;

  constructor(private http: HttpClient, private dateParse:NgbDateParserFormatter) { 
    this.api_url = "//localhost:8080/profile/";
    this.trip_url = "//localhost:8080/trip/userTrips/";
    this.delete_url = "//localhost:8080/trip/";

  }

  getUserName(userid:number){
    return this.http.get(this.api_url+userid,{responseType: 'text'})
  }

  getAllUserTrips (userid:number){
    return this.http.get(this.trip_url+userid);
  }

  submitUserTrip(userid:number, triplocation:string){
    console.log("Submit the trip: ",triplocation," using ID: ",userid);
    const data = {'creatorId':userid,'location':triplocation};
    let addTripUrl = "//localhost:8080/trip/addTrip";
    return this.http.post(addTripUrl,data,{observe:'response'});
  }

  deleteTrip(tripID){
    console.log("Delete this tripe: ",tripID);
    return this.http.delete(this.delete_url+tripID);

  }

  updateDate(userid:number, tripid:number, triplocation:string,fromdate:NgbDate,diffdays:number,cost:any){
    console.log("Update Trip with user ID and Location ", userid,tripid,triplocation,fromdate,diffdays)
    console.log(new Date(fromdate.month,fromdate.day,fromdate.year));
    var newfromdate = fromdate.month + "/" + fromdate.day + "/" + fromdate.year;
    console.log(newfromdate,typeof(newfromdate));
    // 'cost':cost,
    const data = {'id':tripid,'creatorId':userid,'location':triplocation,'cost':cost,'duration':diffdays,'date':newfromdate};
    console.log("ErROR COMING: ",data);

    return this.http.put(this.delete_url+'updateTrip/'+tripid,data,{observe:'response'});
  }

  updateCost(userid:number, tripid:number, triplocation:string,cost:any,fromdate:NgbDate,diffdays:number){
    console.log("Update Trip with user ID and Location ", userid,tripid,triplocation,cost)
    const data = {'id':tripid,'creatorId':userid,'location':triplocation,'cost':cost,'date':fromdate,'duration':diffdays};

    return this.http.put(this.delete_url+'updateTrip/'+tripid,data,{observe:'response'});
  }

}
