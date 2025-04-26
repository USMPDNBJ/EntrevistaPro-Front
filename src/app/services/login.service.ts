import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import login from '../models/login';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  readonly API_URL = "";


  constructor(private http:HttpClient) {

  }

  login(login: login){
      return this.http.post<login>(this.API_URL,login);
  }
}
