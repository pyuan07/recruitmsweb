import { ApplicationStatus, ObjectState } from './../../../_shared/enum/enum';
import { Application } from './../../../models/application-model';

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user-model';
import { Vacancy } from 'src/app/models/vacancy-model';
import { ApplicationService } from 'src/app/services/application.service';
import { ResumeService } from 'src/app/services/resume.service';
import { TokenStorageService } from 'src/app/services/token-storage.service';
import { VacancyService } from 'src/app/services/vacancy.service';
import Swal from 'sweetalert2';
import { Resume } from 'src/app/models/resume-model';
import { X } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-vacancy-details',
  templateUrl: './vacancy-details.component.html',
  styleUrls: ['./vacancy-details.component.css']
})
export class VacancyDetailsComponent implements OnInit {

  vacancyForm!: Vacancy;
  isAdmin: boolean = false;
  isCandidate: boolean = false;
  applied: boolean = false;

  currentUser!: User;
  isMyVancacy: boolean = false;
  candidateResume?: Resume;
  applicationRemarks: string  = '';

  application!: Application;

  constructor(  private _vacancyService: VacancyService, 
                private _resumeService: ResumeService,
                private _applicationsService: ApplicationService,
                private _tokenStorageService: TokenStorageService,
                private route: ActivatedRoute ,
                private router: Router) {  
    this.currentUser = this._tokenStorageService.getUser()!;
    this.isAdmin = this._tokenStorageService.isAdmin();
    this.isCandidate = this._tokenStorageService.isCandidate();
  }
   
    ngOnInit(): void {
      if(this.isCandidate){
        this.getCandidateResume();
      }
      else{
        this.getVacancyDetails(this.route.snapshot.params['id']);
      }
    }

    private getCandidateResume(){
      this._resumeService.getResumeByCandidateId(this.currentUser.userId).subscribe({
        next: data => {
          this.candidateResume = data;
          this.getVacancyDetails(this.route.snapshot.params['id']);
        },
        error: (err: any) => {
          Swal.fire("Something went wrong...","Please create your resume first before applying for a vacancy", "error");
          // this.router.navigate(['resume'])
          console.log(err.error.message);
          this.getVacancyDetails(this.route.snapshot.params['id']);
        }
      });
    }

    private getVacancyDetails(id: number){
      this._vacancyService.getById(id).subscribe({
        next: data => {

          if(this.isCandidate && this.candidateResume != undefined){
            data.tags.forEach((tag) => {
              tag.matched = this.candidateResume!.tags.map(x=>x.name).includes(tag.name);
            });

            this._applicationsService.getByObjState("ACTIVE").subscribe({
              next: data => {
                this.applied = data.filter(x=> x.vacancy.vacancyId == this.vacancyForm!.vacancyId && x.candidate.userId == this.currentUser.userId).length > 0;
              },
              error: err => {
                Swal.fire("Error", err.error.message, "error");
              }
            });
          }
          
          data.tags.sort((n2,n1) => n1.totalUsed - n2.totalUsed);
          
          this.isMyVancacy = data.organization.owner.userId == this.currentUser.userId;
          this.vacancyForm = data;
        },
        error: (err: any) => {
          Swal.fire("Error", err.error.message, "error");
        }
      });
    }

    gotoEditPage(){
      this.router.navigate(['vacancy/edit', this.vacancyForm!.vacancyId])
    }

    applyVacancy(){
      if(this.candidateResume){
        this.application = {
          candidate: this.currentUser,
          resume: this.candidateResume,
          vacancy: this.vacancyForm,
          status: ApplicationStatus.APPLIED,
          remarks: this.applicationRemarks,
          objectState: ObjectState.ACTIVE
        };

        this._applicationsService.create(this.application).subscribe({
          next: data => {
            console.log(data);
            Swal.fire({
              icon: 'success',
              title: 'Applied Successfully!'
            });
            window.location.reload();
          },
          error: err => {
            Swal.fire("Error", err.error.message, "error");
          }
        });
      }else{
        Swal.fire("Something went wrong...","Please create your resume first before applying for a vacancy", "error");
        this.router.navigate(['resume']);
      }
    }

    deleteVacancy(){
      Swal.fire({
        title: 'Do you want to terminate this vacancy?',
        text: "All application related to this vacancy will be updated to CANCEL status after you terminated the vacancy.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes'
      }).then((result) => {
        if (result.isConfirmed) {
          this._vacancyService.delete(this.vacancyForm!.vacancyId).subscribe({
            next: data => {
              if(data){
                Swal.fire("Terminated Successfully", "", "success");
                this.router.navigate(['vacancy'])
              }
              else{
                Swal.fire("Failed to Terminate", "Something went wrong...", "error");
              }
            },
            error: (err: any) => {
              Swal.fire("Error", err.error.message, "error");
            }
          })
        }
      })
    }

    gotoOrganizationPage(){
      this.router.navigate(['organization/details', this.vacancyForm.organization.organizationId])
      //window.open("organization/details"+this.vacancyForm.organization.organizationId,"_blank");
    }
}
