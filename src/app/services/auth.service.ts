import { LoginRequest } from './../models/request/login-request';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SignupRequest } from '../models/request/singup-request';
import { LoginResponse } from '../models/response/login-response';

const AUTH_API = environment.apiEndpoint +'/auth/';
const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }

  login(loginRequest :LoginRequest): Observable<any> {
    return this.http.post<LoginResponse>(AUTH_API + 'login', loginRequest, httpOptions);
  }

  register(signupRequest :SignupRequest): Observable<any> {
    return this.http.post(AUTH_API + 'signup', signupRequest, httpOptions);
  }
}
