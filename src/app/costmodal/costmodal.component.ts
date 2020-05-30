import { Component, OnInit } from '@angular/core';
import { ProfileRetrievalServiceService } from '../profile-retrieval-service.service';

@Component({
  selector: 'app-costmodal',
  templateUrl: './costmodal.component.html',
  styleUrls: ['./costmodal.component.css']
})
export class CostmodalComponent implements OnInit {
  total: any = 0;
  val = 200;
  input1: any;
  input2: any;
  input3: any;
  input4: any;
  input5: any;
  input6: any;
  runningtotal: any;
  constructor(private profService: ProfileRetrievalServiceService) { }

  ngOnInit() {


  }

  ngOnChanges() {
  }

  calcSubmit() {
    console.log("Submitting the total of: ", this.total, typeof (this.total));
    let stuff = JSON.parse(sessionStorage.getItem('stuff'));
    console.log(stuff.date, stuff.duration)
    this.profService.updateCost(stuff.creatorId, stuff.id, stuff.location, this.total, stuff.date, stuff.duration).subscribe(data => {
      console.log(data);
      // var place:any = data.body;
      // var datenum = place.date;
      // console.log(datenum);;
      this.update({ "cost": `${this.total}` })
    });
  }

  runningTotal(event) {
    this.total = 0;
    var input_list = [this.input1, this.input2, this.input3, this.input4, this.input5, this.input6]
    input_list.forEach(element => {element ? this.total += parseInt(element) : this});
  }

  update(value) {
    let prevData = JSON.parse(sessionStorage.getItem('stuff'));
    Object.keys(value).forEach(function (val, key) {
      prevData[val] = value[val];
    })
    sessionStorage.setItem('stuff', JSON.stringify(prevData));
  }

  // checkInput(inputVal){
  //   if(inputVal == 'NaN'){
  //     console.log("reset it")
  //   }
  //   console.log(inputVal)
  //   return 20;
  // }
}
