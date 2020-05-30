import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoordsServiceService {

  constructor(private http:HttpClient) { }
  coordsAPI:string = "//localhost:8080/tripcoords/";
  getCoords(id){
    //get coords from DB
    return this.http.get(this.coordsAPI+'/'+id);
  }

  saveCoords(coords){
    console.log('this is a list of coords: ',coords);
    // console.log("Submit the trip: ",triplocation," using ID: ",userid);
    // const data = {'creatorId':userid,'location':triplocation};
    // let addTripUrl = "//localhost:8080/trip/addTrip";
    console.log("Url we are hitting: ",this.coordsAPI+'addCoords')
    return this.http.post("http://localhost:8080/tripcoords/addCoords",coords,{observe:'response'});

  }

  saveCoordsFirsTime(uh){

  }
}
