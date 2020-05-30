import { Component, OnInit, Input } from '@angular/core';
import { NgbDate, NgbCalendar, NgbDateParserFormatter } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { ProfileRetrievalServiceService } from '../profile-retrieval-service.service';


@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrls: ['./datepicker.component.css']
})
export class DatepickerComponent implements OnInit {

  @Input() noEdit: string;

  hoveredDate: NgbDate;
  isDisabled = (date: NgbDate) => date.day;
  fromDate: NgbDate;
  toDate: NgbDate;
  testDate: any;
  saveFlag: any;
  storageItem: any;
  diffinDays: any;
  startingDate: any;
  calendarFlag:boolean;

  constructor(private calendar: NgbCalendar, private dateFormat: NgbDateParserFormatter, private profServe: ProfileRetrievalServiceService) {


    this.storageItem = JSON.parse(sessionStorage.getItem("stuff"));
    this.saveFlag = true;
    this.startingDate = calendar.getToday();

    this.fromDate = this.storageItem.date;

    if (this.fromDate) {
      this.calendarFlag = true;
    }
    else{
      this.calendarFlag = false;
      
    }
    this.testDate = new Date(this.storageItem.date);
    this.fromDate = new NgbDate(this.testDate.getFullYear(), this.testDate.getMonth() + 1, this.testDate.getDate());


    this.toDate = calendar.getNext(this.fromDate, 'd', parseInt(this.storageItem.duration));
    
  }

  onDateSelection(date: NgbDate) {
    if (!this.fromDate && !this.toDate) {
      this.fromDate = date;
    } else if (this.fromDate && !this.toDate && date.after(this.fromDate)) {
      this.toDate = date;
    }
    else {
      this.toDate = null;
      this.fromDate = date;
    }
  }

  isHovered(date: NgbDate) {
    return this.fromDate && !this.toDate && this.hoveredDate && date.after(this.fromDate) && date.before(this.hoveredDate);
  }

  isInside(date: NgbDate) {
    return date.after(this.fromDate) && date.before(this.toDate);
  }

  isRange(date: NgbDate) {
    return date.equals(this.fromDate) || date.equals(this.toDate) || this.isInside(date) || this.isHovered(date);
  }

  ngOnInit() {

  }

  ngOnChanges() {
    if (!this.saveFlag) {
      this.diffinDays = moment(this.dateFormat.format(this.toDate)).diff(moment(this.dateFormat.format(this.fromDate)), 'days');
      var stuff = JSON.parse(sessionStorage.getItem("stuff"));
      console.log("WHATS IN STUFF: ", stuff)
      this.profServe.updateDate(stuff.creatorId, stuff.id, stuff.location, this.fromDate, this.diffinDays, stuff.cost).subscribe(data => {
        console.log(data);
        var place: any = data.body;
        var datenum = place.date;
        console.log(datenum);;
        this.update({ "date": `${datenum}` })
        this.update({ "duration": this.diffinDays });
        // sessionStorage.setItem("stuff['date']",JSON.stringify(`${datenum}`));
        // console.log(data.body.date);
      });
    }

    this.saveFlag = this.noEdit;


  }

  update(value) {
    let prevData = JSON.parse(sessionStorage.getItem('stuff'));
    Object.keys(value).forEach(function (val, key) {
      prevData[val] = value[val];
    })
    sessionStorage.setItem('stuff', JSON.stringify(prevData));
  }


}
