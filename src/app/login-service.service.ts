import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { User } from './user';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginServiceService {

  private api_url:string;
  constructor(private http: HttpClient) { 
    this.api_url = "//localhost:8080/user/";
  }

  getAllUsers () : Observable<User[]> {
    return this.http.get<User[]>(this.api_url);
  }

  getInfo(email:string, password:string){
    console.log("Requesting Information with: ",email,password);
    const data = {'email':email,'password':password};
    let email_url = this.api_url+'email';
    return this.http.post(email_url,data,{observe: 'response'});
  }
}
