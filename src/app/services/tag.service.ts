import { ExtractTagsRequest } from './../models/request/extract-tags-request';
import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tag } from '../models/tag-model';

const TAG_API = environment.apiEndpoint +'/v1/tag';

@Injectable({ providedIn: 'root' })
export class TagService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Tag[]> {
    return this.http.get<Tag[]>(TAG_API);
  }

  getByObjState(state: String): Observable<Tag[]> {
    return this.http.get<Tag[]>(TAG_API + '/objectState/' + state);
  }

  getById(id: string): Observable<Tag> {
    return this.http.get<Tag>(TAG_API + '/id/'+ id);
  }

  create(tag: Tag): Observable<Tag> {
    return this.http.post<Tag>(TAG_API, tag);
  }

  update(tag: Tag): Observable<Tag> {
    return this.http.put<Tag>(TAG_API, tag);
  }

  delete(id: string): Observable<boolean>{
    return this.http.delete<boolean>(TAG_API + '/' + id);
  }

  extractTags(req: ExtractTagsRequest): Observable<Tag[]> {
    return this.http.post<Tag[]>(TAG_API + '/extract', req);
  }
}
