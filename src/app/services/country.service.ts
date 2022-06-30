import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Country } from '../models/country-model';

const COUNTRY_API = environment.apiEndpoint +'/v1/country';

@Injectable({ providedIn: 'root' })
export class CountryService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Country[]> {
    return this.http.get<Country[]>(COUNTRY_API);
  }

  getByIso(iso: string): Observable<Country> {
    return this.http.get<Country>(COUNTRY_API + '/iso/'+ iso);
  }

  getByCode(code: string): Observable<Country> {
    return this.http.get<Country>(COUNTRY_API + '/code/'+ code);
  }

}
