import { Role } from './../_shared/enum/enum';
import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../models/user-model';

const USER_API = environment.apiEndpoint +'/v1/user';


@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(USER_API);
  }

  getByObjState(state: String): Observable<User[]> {
    return this.http.get<User[]>(USER_API + '/objectState/' + state);
  }

  getByRole(role: String): Observable<User[]> {
    return this.http.get<User[]>(USER_API + '/role/'+ role);
  }

  getById(id: string): Observable<User> {
    return this.http.get<User>(USER_API + '/id/'+ id);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(USER_API, user);
    // switch(user.roles) {
    //   case Role.CANDIDATE:
    //     const candidate: Candidate = {
    //       userId: '',
    //       user: user
    //     };
    //     return this.http.post<Candidate>(CANDIDATE_API, candidate);
    //   case Role.STAFF:
    //     const staff: Staff = {
    //       userId: '',
    //       user: user
    //     };
    //     return this.http.post<Staff>(STAFF_API, staff);
    //   case Role.EMPLOYER:
    //     const employer: Employer = {
    //       userId: '',
    //       user: user
    //     };
    //     return this.http.post<Employer>(EMPLOYER_API, employer);
    //   default:
    //     return this.http.post<User>(USER_API, user);
    // }
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(USER_API, user);
  }

  delete(id: string): Observable<boolean>{
    return this.http.delete<boolean>(USER_API + '/' + id);
  }
}
