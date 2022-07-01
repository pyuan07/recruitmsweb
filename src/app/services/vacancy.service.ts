import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Vacancy } from '../models/vacancy-model';

const VACANCY_API = environment.apiEndpoint +'/v1/vacancy';

@Injectable({ providedIn: 'root' })
export class VacancyService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(VACANCY_API);
  }

  getByObjState(state: String): Observable<Vacancy[]> {
    return this.http.get<Vacancy[]>(VACANCY_API + '/objectState/' + state);
  }

  getById(id: string): Observable<Vacancy> {
    return this.http.get<Vacancy>(VACANCY_API + '/id/'+ id);
  }

  create(vacancy: Vacancy): Observable<Vacancy> {
    return this.http.post<Vacancy>(VACANCY_API, vacancy);
  }

  update(vacancy: Vacancy): Observable<Vacancy> {
    return this.http.put<Vacancy>(VACANCY_API, vacancy);
  }

  delete(id: string): Observable<boolean>{
    return this.http.delete<boolean>(VACANCY_API + '/' + id);
  }
}