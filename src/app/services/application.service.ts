import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Application } from '../models/application-model';

const APPLICATION_API = environment.apiEndpoint +'/v1/application';

@Injectable({ providedIn: 'root' })
export class ApplicationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Application[]> {
    return this.http.get<Application[]>(APPLICATION_API);
  }

  getByObjState(state: String): Observable<Application[]> {
    return this.http.get<Application[]>(APPLICATION_API + '/objectState/' + state);
  }

  getById(id: number): Observable<Application> {
    return this.http.get<Application>(APPLICATION_API + '/id/'+ id);
  }

  create(application: Application): Observable<Application> {
    return this.http.post<Application>(APPLICATION_API, application);
  }

  update(application: Application): Observable<Application> {
    return this.http.put<Application>(APPLICATION_API, application);
  }

  delete(id: number): Observable<boolean>{
    return this.http.delete<boolean>(APPLICATION_API + '/' + id);
  }

  getByStatus(status: string): Observable<Application[]> {
    return this.http.get<Application[]>(APPLICATION_API + '/status/' + status);
  }
}
