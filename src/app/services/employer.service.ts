import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Employer } from '../models/employer-model';

const USER_API = environment.apiEndpoint +'/v1/employer';

@Injectable({ providedIn: 'root' })
export class EmployerService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Employer[]> {
    return this.http.get<Employer[]>(USER_API);
  }

  getByObjState(state: String): Observable<Employer[]> {
    return this.http.get<Employer[]>(USER_API + '/objectState/' + state);
  }

  getById(id: string): Observable<Employer> {
    return this.http.get<Employer>(USER_API + '/id/'+ id);
  }

  create(employer: Employer): Observable<Employer> {
    return this.http.post<Employer>(USER_API, employer);
  }

  update(employer: Employer): Observable<Employer> {
    return this.http.put<Employer>(USER_API, employer);
  }

  delete(id: string): Observable<boolean>{
    return this.http.delete<boolean>(USER_API + '/' + id);
  }
}
