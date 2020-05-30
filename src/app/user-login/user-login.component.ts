import { Component, OnInit } from '@angular/core';
import { LoginServiceService } from '../login-service.service';
import { Router } from '@angular/router';

// import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})
export class UserLoginComponent implements OnInit {

  
  password: string;
  email: string;
  users: any;
  info: any;
  userid: any;

  constructor(private logserv: LoginServiceService, private _router:Router) { 
    console.log("Log in component generated");
    
  }

  ngOnInit() {
  }

  onSubmit() {
    // this.logserv.getAllUsers().subscribe(data => {
    //   this.users = data;
    //   console.log(this.users)
    // })
    this.logserv.getInfo(this.email,this.password).subscribe(data => {
      this.info = data;
      status = this.info.status;
      // console.log("HERE: ",this.info.status);
      if(status == '200'){
        // this._router.navigate(['trippage']);
        // console.log("LET ME IN")
        // console.log(this.info)
      }
      else{
        alert("SOMETHINGS WRONG I CAN FEEL IT");
      }
    })
  }

  betaAccess(){
    this.logserv.getInfo('bizzer4life@gmail.com','test456').subscribe(data => {
      this.info = data;
      status = this.info.status;
      this.userid = this.info.body;
      if(this.userid){
        // console.log("LET ME IN")
        // console.log(this.info)
        this._router.navigate(['trippage'],{queryParams: {userid:this.userid}});
      }
      else{
        alert("SOMETHINGS WRONG I CAN FEEL IT");
      }
    })
  }

}
