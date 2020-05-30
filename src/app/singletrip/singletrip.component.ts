import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { CityActivityService } from '../city-activity.service';
import { faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { CoordsServiceService } from '../coords-service.service';


@Component({
  selector: 'app-singletrip',
  templateUrl: './singletrip.component.html',
  styleUrls: ['./singletrip.component.css']
})
export class SingletripComponent implements OnInit {

  firstItem: any;
  mapURL: string;
  urlSafe: SafeResourceUrl;
  cityData: any;
  activityData: any;
  countryCityData: any;
  objectData: any;
  faLock = faLock;
  faLockOpen = faLockOpen;
  noEdit: boolean = true;
  showFirst: boolean;
  morecords: any;
  firstLat: any;
  firstLong: any;

  showMap:boolean = false;

  coordsList = [];

  // allSaved = false;

  constructor(private coordService: CoordsServiceService, public sanitizer: DomSanitizer, private cityActiveServ: CityActivityService) {
    this.firstItem = JSON.parse(sessionStorage.getItem("stuff"));

    this.coordService.getCoords(this.firstItem.id).subscribe(data => {
      this.objectData = data;
      if (data) {
        console.log(data);
        this.morecords = data;
        this.morecords = this.morecords.map(({ latitude, longitude, note, id }) => ({ latitude, longitude, note, id }));
        this.firstLat = parseFloat(this.morecords[0].latitude);
        this.firstLong = parseFloat(this.morecords[0].longitude);
        this.coordsList = this.coordsList.concat(this.morecords);
        this.showMap = true;
      }

    })
    if(this.firstItem.location){
      this.showMap = true;
    }
  }

  ngOnInit() {
    this.showFirst = true;
    // this.objectData = [
    //   {
    //     city:'Madrid',
    //     population: '300,000'
    //   },
    //   {
    //     city:'Real',
    //     population: '300,000'
    //   },
    //   {
    //     city:'Barcelona',
    //     population: '300,000'
    //   }
    // ]
  }

  editOpen() {
    this.showFirst = !this.showFirst
    if (this.showFirst) {
      console.log("Lock was closed save the dates")
    }
  }
}
