import { UploadResponse } from './../models/response/upload-response';
import { ObjectState } from 'src/app/_shared/enum/enum';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Resume } from '../models/resume-model';
import { ResumeCreateRequest } from '../models/request/resume-create-request';
import { ResumeModifyRequest } from '../models/request/resume-modify-request';
import { Tag } from '../models/tag-model';

const RESUME_API = environment.apiEndpoint +'/v1/resume';

@Injectable({ providedIn: 'root' })
export class ResumeService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<Resume[]> {
    return this.http.get<Resume[]>(RESUME_API);
  }

  getByObjState(state: String): Observable<Resume[]> {
    return this.http.get<Resume[]>(RESUME_API + '/objectState/' + state);
  }

  getById(id: string): Observable<Resume> {
    return this.http.get<Resume>(RESUME_API + '/id/'+ id);
  }

  create(resumeRequest: ResumeCreateRequest): Observable<Resume> {
    return this.http.post<Resume>(RESUME_API, resumeRequest);
  }

  update(resume: ResumeModifyRequest): Observable<Resume> {
    return this.http.put<Resume>(RESUME_API, resume);
  }

  delete(id: string): Observable<boolean>{
    return this.http.delete<boolean>(RESUME_API + '/' + id);
  }

  uploadResume(formData: FormData): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(RESUME_API+ '/upload/pdf', formData);
  }

  uploadProfilePic(formData: FormData): Observable<UploadResponse> {
    return this.http.post<UploadResponse>(RESUME_API+ '/upload/image', formData);
  }

  downloadResume(filename: string): Observable<any> {
    return this.http.get<any>(RESUME_API + '/download/pdf/'+ filename);
  }

  downloadProfilePic(filename: string): Observable<Blob> {
    return this.http.get<Blob>(RESUME_API + '/download/image/'+ filename);
  }

  getResumeByCandidateId(userId: string): Observable<Resume> {
    return this.http.get<Resume>(RESUME_API + '/getResumeByCandidateId/'+ userId);
  }

  extractTagsFromResume(filename: string): Observable<Tag[]>{
    return this.http.get<Tag[]>(RESUME_API + '/extract/pdf/'+ filename);
  }
}
