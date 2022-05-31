import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../user/models/user-model';

const USER_API = environment.apiEndpoint +'/v1/user';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) { }

  getActive(): Observable<User[]> {
    return this.http.get<User[]>(USER_API + '/active');
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(USER_API, user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(USER_API, user);
  }
}
