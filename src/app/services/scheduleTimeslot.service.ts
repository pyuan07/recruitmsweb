import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ScheduleTimeslot } from '../models/scheduleTimeslot-model';

const SCHEDULE_TIMESLOT_API = environment.apiEndpoint +'/v1/scheduleTimeslot';

@Injectable({ providedIn: 'root' })
export class ScheduleTimeslotService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<ScheduleTimeslot[]> {
    return this.http.get<ScheduleTimeslot[]>(SCHEDULE_TIMESLOT_API);
  }

  getByObjState(state: String): Observable<ScheduleTimeslot[]> {
    return this.http.get<ScheduleTimeslot[]>(SCHEDULE_TIMESLOT_API + '/objectState/' + state);
  }

  getByVacancyId(id: number): Observable<ScheduleTimeslot[]> {
    return this.http.get<ScheduleTimeslot[]>(SCHEDULE_TIMESLOT_API + '/vacancy/' + id);
  }

  getById(id: number): Observable<ScheduleTimeslot> {
    return this.http.get<ScheduleTimeslot>(SCHEDULE_TIMESLOT_API + '/id/'+ id);
  }

  create(scheduleTimeslot: ScheduleTimeslot): Observable<ScheduleTimeslot> {
    return this.http.post<ScheduleTimeslot>(SCHEDULE_TIMESLOT_API, scheduleTimeslot);
  }

  update(scheduleTimeslot: ScheduleTimeslot): Observable<ScheduleTimeslot> {
    return this.http.put<ScheduleTimeslot>(SCHEDULE_TIMESLOT_API, scheduleTimeslot);
  }

  delete(id: number): Observable<boolean>{
    return this.http.delete<boolean>(SCHEDULE_TIMESLOT_API + '/' + id);
  }
}
