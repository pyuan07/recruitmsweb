import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Schedule } from '../models/schedule-model';

const SCHEDULE_API = environment.apiEndpoint +'/v1/schedule';

@Injectable({ providedIn: 'root' })
export class ScheduleService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(SCHEDULE_API);
  }

  getByObjState(state: String): Observable<Schedule[]> {
    return this.http.get<Schedule[]>(SCHEDULE_API + '/objectState/' + state);
  }

  getByApplicationId(id: number): Observable<Schedule> {
    return this.http.get<Schedule>(SCHEDULE_API + '/application/' + id);
  }

  getById(id: string): Observable<Schedule> {
    return this.http.get<Schedule>(SCHEDULE_API + '/id/'+ id);
  }

  create(schedule: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>(SCHEDULE_API, schedule);
  }

  update(schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(SCHEDULE_API, schedule);
  }

  delete(id: string): Observable<boolean>{
    return this.http.delete<boolean>(SCHEDULE_API + '/' + id);
  }
}
