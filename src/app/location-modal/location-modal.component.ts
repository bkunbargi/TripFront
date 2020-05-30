import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-location-modal',
  templateUrl: './location-modal.component.html',
  styleUrls: ['./location-modal.component.css']
})
export class LocationModalComponent implements OnInit {

  // @Input() 
  // myName:string;
  locationInput:string;

  @Output()
  notify:EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output()
  locationSend: EventEmitter<string> = new EventEmitter<string>();
  

  constructor() {}
  ngOnInit() {
  }


  passData(){
    this.notify.emit(false);
  }

  submitLocation(){
    this.locationSend.emit(this.locationInput);
  }


}
