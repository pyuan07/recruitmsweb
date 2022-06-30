import { OrganizationCreateRequest } from './../models/request/organization-create-request';
import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Organization } from '../models/organization-model';

const ORGANIZATION_API = environment.apiEndpoint +'/v1/organization';

@Injectable({ providedIn: 'root' })
export class OrganizationService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Organization[]> {
    return this.http.get<Organization[]>(ORGANIZATION_API);
  }

  getByObjState(state: String): Observable<Organization[]> {
    return this.http.get<Organization[]>(ORGANIZATION_API + '/objectState/' + state);
  }

  getById(id: string): Observable<Organization> {
    return this.http.get<Organization>(ORGANIZATION_API + '/id/'+ id);
  }

  create(organizationRequest: OrganizationCreateRequest): Observable<Organization> {
    return this.http.post<Organization>(ORGANIZATION_API , organizationRequest);
  }

  update(organization: Organization): Observable<Organization> {
    return this.http.put<Organization>(ORGANIZATION_API, organization);
  }

  delete(id: string): Observable<boolean>{
    return this.http.delete<boolean>(ORGANIZATION_API + '/' + id);
  }
}
